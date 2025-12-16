import re

def clean_message(msg):
    msg = msg.strip()
    # Take only the first line (subject) for the new message generation to keep it concise
    subject = msg.split('\n')[0].strip()
    
    # Heuristics on the subject
    lower_msg = subject.lower()
    
    # Check if already conventional
    match = re.match(r'^(\w+)(\(.*\))?: (.*)', subject)
    if match:
        # Already conventional-ish
        # Just ensure lowercase type
        prefix = match.group(1).lower()
        scope = match.group(2) or ""
        content = match.group(3)
        return f"{prefix}{scope}: {content}"

    new_msg = ""
    
    if lower_msg.startswith("add") or lower_msg.startswith("added") or lower_msg.startswith("create") or lower_msg.startswith("created") or lower_msg.startswith("implement") or lower_msg.startswith("feat") or lower_msg.startswith("new"):
        new_msg = f"feat: {subject}"
    
    elif lower_msg.startswith("fix") or lower_msg.startswith("fixed") or lower_msg.startswith("resolve") or lower_msg.startswith("resolved") or lower_msg.startswith("bug") or lower_msg.startswith("correct"):
        new_msg = f"fix: {subject}"
        
    elif lower_msg.startswith("update") or lower_msg.startswith("updated") or lower_msg.startswith("change") or lower_msg.startswith("changed") or lower_msg.startswith("adjust") or lower_msg.startswith("adjusted") or lower_msg.startswith("tweak") or lower_msg.startswith("modify"):
        new_msg = f"chore: {subject}"
        
    elif lower_msg.startswith("refactor") or lower_msg.startswith("refactored") or lower_msg.startswith("clean") or lower_msg.startswith("cleanup") or lower_msg.startswith("reorganize") or lower_msg.startswith("move") or lower_msg.startswith("extract"):
        new_msg = f"refactor: {subject}"
        
    elif lower_msg.startswith("remove") or lower_msg.startswith("removed") or lower_msg.startswith("delete") or lower_msg.startswith("deleted"):
        new_msg = f"chore: {subject}"
        
    elif lower_msg.startswith("doc") or lower_msg.startswith("docs") or lower_msg.startswith("document"):
        new_msg = f"docs: {subject}"
        
    elif lower_msg.startswith("style") or lower_msg.startswith("styling") or lower_msg.startswith("ui") or lower_msg.startswith("css"):
        new_msg = f"style: {subject}"
        
    elif lower_msg.startswith("test") or lower_msg.startswith("tests"):
        new_msg = f"test: {subject}"
        
    elif "readme" in lower_msg:
        new_msg = f"docs: {subject}"
        
    elif "merge" in lower_msg:
        new_msg = f"chore: {subject}"
        
    elif "initial commit" in lower_msg:
        new_msg = f"feat: {subject}"
        
    else:
        new_msg = f"chore: {subject}"

    return new_msg

def format_final_message(msg):
    match = re.match(r'^(\w+)(\(.*\))?: (.*)', msg)
    if match:
        prefix = match.group(1)
        scope = match.group(2) or ""
        content = match.group(3)
        
        # Lowercase first letter of content
        content = content[0].lower() + content[1:] if content else ""
        
        # Remove redundant prefix in content
        # e.g. "feat: Add feature" -> "feat: add feature"
        # e.g. "feat: feat: feature" -> "feat: feature"
        if content.lower().startswith(prefix + ":"):
             content = content[len(prefix)+1:].strip()
        
        return f"{prefix}{scope}: {content}"
    return msg

commits = []
current_commit = []
with open("commit_log_full.txt", "r", encoding="utf-8", errors="replace") as f:
    content = f.read()
    raw_commits = content.split("\n__END_COMMIT__\n")
    
    for rc in raw_commits:
        if not rc.strip():
            continue
        # The first line might contain the hash|message start
        # But since message can be multi-line, we need to be careful.
        # The format was %H|%B
        # So the first 40 chars are hash, then |, then message.
        if "|" in rc:
            parts = rc.split("|", 1)
            if len(parts) == 2:
                commits.append((parts[0], parts[1]))

print("import git_filter_repo as fr")
print("")
print("MESSAGES = {")

for sha, original_msg in commits:
    original_msg_stripped = original_msg.strip()
    new_msg = clean_message(original_msg_stripped)
    new_msg = format_final_message(new_msg)
    
    # Python repr() gives a string representation that is valid python code (usually)
    # We need bytes for git-filter-repo
    
    # We need to handle newlines in the original message for the key
    # Using repr() on the byte string is safest
    
    orig_bytes = original_msg_stripped.encode('utf-8')
    new_bytes = new_msg.encode('utf-8')
    
    print(f"    {repr(orig_bytes)}: {repr(new_bytes)},")

print("}")
print("")
print("def commit_callback(commit, metadata):")
print("    msg = commit.message.strip()")
print("    if msg in MESSAGES:")
print("        commit.message = MESSAGES[msg]")
print("    else:")
print("        # Try to match without strict whitespace if exact match fails")
print("        pass")
print("")
print("fr.RepoFilter(fr.FilteringOptions(force=True), commit_callback=commit_callback).run()")
