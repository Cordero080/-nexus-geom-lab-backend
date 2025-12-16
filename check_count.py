import re

with open('do_rewrite.py', 'r') as f:
    content = f.read()

# Count occurrences of "b'..." : b'..."
matches = re.findall(r"b'.*?': b'.*?'", content, re.DOTALL)
print(f"Estimated mappings: {len(matches)}")
