import re
import subprocess

def clean_key(k):
    if isinstance(k, bytes):
        k = k.decode('utf-8')
    return k.replace('__END_COMMIT__', '').strip()

def get_git_log():
    cmd = ['git', 'log', '--pretty=format:%B%n__END_COMMIT__']
    result = subprocess.run(cmd, capture_output=True, text=True)
    logs = result.stdout.split('\n__END_COMMIT__\n')
    if logs and logs[-1].strip() == '':
        logs.pop()
    return [msg.strip() for msg in logs]

def generate_new_message(msg):
    lines = msg.split('\n')
    subject = lines[0].strip()
    
    # Check if it already follows convention
    match = re.match(r'^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(\(.+\))?: .+', subject, re.IGNORECASE)
    if match:
        # Ensure lowercase type
        parts = subject.split(':', 1)
        return parts[0].lower() + ':' + parts[1]
    
    lower_subject = subject.lower()
    if 'fix' in lower_subject or 'bug' in lower_subject or 'resolve' in lower_subject or 'correct' in lower_subject:
        type_ = 'fix'
    elif 'add' in lower_subject or 'feat' in lower_subject or 'create' in lower_subject or 'implement' in lower_subject or 'new' in lower_subject:
        type_ = 'feat'
    elif 'doc' in lower_subject or 'readme' in lower_subject:
        type_ = 'docs'
    elif 'style' in lower_subject or 'css' in lower_subject or 'ui' in lower_subject or 'format' in lower_subject:
        type_ = 'style'
    elif 'refactor' in lower_subject or 'clean' in lower_subject or 'organize' in lower_subject or 'remove' in lower_subject or 'move' in lower_subject:
        type_ = 'refactor'
    elif 'test' in lower_subject:
        type_ = 'test'
    else:
        type_ = 'chore'
        
    if subject.endswith('.'):
        subject = subject[:-1]
        
    return f"{type_}: {subject}"

def main():
    with open('do_rewrite.py', 'r') as f:
        content = f.read()
    
    match = re.search(r'MESSAGES = \{(.*?)\}', content, re.DOTALL)
    dict_content = match.group(1)
    pattern = re.compile(r"(b['\"](?:[^'\"]|\\'|\\\")*['\"])\s*:\s*(b['\"](?:[^'\"]|\\'|\\\")*['\"])")
    
    mappings = {}
    for m in pattern.finditer(dict_content):
        try:
            k = eval(m.group(1))
            v = eval(m.group(2))
            clean_k = clean_key(k)
            mappings[clean_k] = v.decode('utf-8')
        except:
            pass
        
    logs = get_git_log()
    final_mappings = {}
    
    for msg in logs:
        if msg in mappings:
            final_mappings[msg] = mappings[msg]
        else:
            # Try loose matching
            found = False
            for k, v in mappings.items():
                if msg == k:
                    final_mappings[msg] = v
                    found = True
                    break
            
            if not found:
                final_mappings[msg] = generate_new_message(msg)
                
    with open('rewrite_history_final.py', 'w') as f:
        f.write("import git_filter_repo as fr\n\n")
        f.write("MESSAGES = {\n")
        for k, v in final_mappings.items():
            # We use the EXACT message from git log as key, encoded to bytes
            k_repr = repr(k.encode('utf-8'))
            v_repr = repr(v.encode('utf-8'))
            f.write(f"    {k_repr}: {v_repr},\n")
        f.write("}\n\n")
        f.write("""
def commit_callback(commit, metadata):
    msg = commit.message.strip()
    if msg in MESSAGES:
        commit.message = MESSAGES[msg]
    else:
        # Fallback for any slight encoding/whitespace differences
        pass

args = fr.FilteringOptions.parse_args(['--force'])
fr.RepoFilter(args, commit_callback=commit_callback).run()
""")

if __name__ == '__main__':
    main()
