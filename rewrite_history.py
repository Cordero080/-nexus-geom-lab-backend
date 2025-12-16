import git_filter_repo as fr
import re

def clean_message(message):
    if isinstance(message, bytes):
        message = message.decode('utf-8')
    
    lines = message.splitlines()
    if not lines:
        return b""
    
    subject = lines[0].strip()
    body = "\n".join(lines[1:]).strip()
    
    # Skip if empty
    if not subject:
        return b""

    # Heuristics
    lower_subject = subject.lower()
    
    # If already conventional, just ensure formatting (optional, but let's keep it simple)
    if re.match(r'^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.*\))?:', lower_subject):
        return message.encode('utf-8')
    
    prefix = "chore" # Default fallback
    
    # Map keywords to types
    if re.match(r'^(add|added|implement|create|new|feat|feature)', lower_subject):
        prefix = "feat"
    elif re.match(r'^(fix|fixed|resolve|correct|bug|patch|repair|restore)', lower_subject):
        prefix = "fix"
    elif re.match(r'^(update|adjust|change|modify|tweak|set|force|boost|increase|reduce|scale)', lower_subject):
        prefix = "chore" # Context dependent, but chore is safe. "style" if purely visual?
    elif re.match(r'^(refactor|clean|simplify|optimize|reorganize|move|split|extract|consolidate|modularize|flatten)', lower_subject):
        prefix = "refactor"
    elif re.match(r'^(doc|docs|document|readme|reviewing)', lower_subject):
        prefix = "docs"
    elif re.match(r'^(remove|delete|drop|unused|dead)', lower_subject):
        prefix = "chore"
    elif re.match(r'^(style|format|lint|ui|layout|design|color|css|scss)', lower_subject):
        prefix = "style"
    elif re.match(r'^(test|tests|spec|jest)', lower_subject):
        prefix = "test"
    elif re.match(r'^(merge)', lower_subject):
        return message.encode('utf-8') # Keep merge commits as is
        
    # Special cases from log
    if "typo" in lower_subject:
        prefix = "docs"
    if "bump" in lower_subject:
        prefix = "chore"
        
    # Construct new subject
    # We keep the original text but prefix it.
    # Example: "Add login" -> "feat: Add login"
    
    # Ensure the first letter of the original message is preserved (or lowercased if we want strict conventional, but preserving is safer for readability)
    # Let's just prepend.
    
    new_subject = f"{prefix}: {subject}"
    
    # Reassemble
    new_message = new_subject
    if body:
        new_message += "\n\n" + body
        
    return new_message.encode('utf-8')

def message_callback(message):
    return clean_message(message)

# Run filter-repo
# We use --force because we are not in a fresh clone
# We use --refs main to only rewrite the main branch (and its history)
# This will detach main from the old history.
args = fr.FilteringOptions.parse_args(['--force', '--refs', 'main'])
fr.RepoFilter(args, message_callback=message_callback).run()
