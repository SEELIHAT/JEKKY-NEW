# Ask the user for their name
name = input("Enter your name: ")

# Check if the name starts with the letter 'a' (case-insensitive)
if name.lower().startswith('a'):
    print("Hello guest")
else:
    print(f"Hello {name}!")