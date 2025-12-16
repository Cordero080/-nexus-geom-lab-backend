import re
import subprocess

def get_git_log():
    # Get full messages. Use a separator that is unlikely to be in the message.
    # %B gives the raw body.
    cmd = ['git', 'log', '--pretty=format:%B%n__END_COMMIT__']
    result = subprocess.run(cmd, capture_output=True, text=True)
    # Split by __END_COMMIT__\n
    logs = result.stdout.split('\n__END_COMMIT__\n')
    # Remove empty last element if any
    if logs and logs[-1].strip() == '':
        logs.pop()
    return [msg.strip() for msg in logs]

def get_existing_mappings(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract the dictionary content. 
    # Assuming MESSAGES = { ... } structure.
    match = re.search(r'MESSAGES = \{(.*?)\}', content, re.DOTALL)
    if not match:
        return {}
    
    dict_content = match.group(1)
    # Parse the dictionary keys. This is a bit hacky with regex but safer than eval if we are careful.
    # We look for b'...' : b'...'
    # The keys are the original messages.
    
    mappings = {}
    # Regex to find key-value pairs. 
    # Keys and values are bytes literals b'...'.
    # We need to handle escaped quotes if any, but for now let's try a simple regex.
    # This regex assumes keys and values are wrapped in b'...' or b"..."
    pattern = re.compile(r"(b['\"](?:[^'\"]|\\'|\\\")*['\"])\s*:\s*(b['\"](?:[^'\"]|\\'|\\\")*['\"])")
    
    for m in pattern.finditer(dict_content):
        k = eval(m.group(1)) # safely eval the byte string literal
        v = eval(m.group(2))
        mappings[k.decode('utf-8')] = v.decode('utf-8')
        
    return mappings

def main():
    logs = get_git_log()
    mappings = get_existing_mappings('do_rewrite.py')
    
    missing = []
    for msg in logs:
        if msg not in mappings:
            missing.append(msg)
            
    print(f"Total commits: {len(logs)}")
    print(f"Existing mappings: {len(mappings)}")
    print(f"Missing mappings: {len(missing)}")
    
    with open('missing_commits.txt', 'w') as f:
        for msg in missing:
            f.write(msg + "\n" + "-"*20 + "\n")

if __name__ == '__main__':
    main()
