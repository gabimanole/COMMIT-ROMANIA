#!/bin/bash

# COMMIT Romania - Problem Generator Script
# This script creates a new problem directory with the standard structure

if [ $# -lt 1 ]; then
    echo "Usage: $0 <problem-name>"
    echo "Example: $0 my-awesome-problem"
    exit 1
fi

PROBLEM_NAME="$1"
PROBLEM_DIR="problems/$PROBLEM_NAME"

if [ -d "$PROBLEM_DIR" ]; then
    echo "Error: Problem directory '$PROBLEM_DIR' already exists"
    exit 1
fi

echo "Creating new problem: $PROBLEM_NAME"
echo "====================================="

# Create directory structure
mkdir -p "$PROBLEM_DIR/tests/input"
mkdir -p "$PROBLEM_DIR/tests/output"

# Copy template files
cp "problems/template/statement.md" "$PROBLEM_DIR/"
cp "problems/template/solution.cpp" "$PROBLEM_DIR/"
cp "problems/template/constraints.txt" "$PROBLEM_DIR/"

# Create README for the problem
cat > "$PROBLEM_DIR/README.md" << EOF
# $PROBLEM_NAME

This problem was created using the COMMIT Romania problem generator.

## Files

- \`statement.md\` - Problem statement (edit this!)
- \`solution.cpp\` - Reference solution (implement this!)
- \`constraints.txt\` - Problem constraints
- \`tests/\` - Test cases directory

## Next Steps

1. Edit \`statement.md\` with your problem description
2. Implement the solution in \`solution.cpp\`
3. Add test cases in the \`tests/\` directory
4. Update \`constraints.txt\` with appropriate limits
5. Test your solution using: \`../../scripts/test_problem.sh .\`

## Test Case Naming

- Input files: \`tests/input/01.txt, 02.txt, ...\`
- Output files: \`tests/output/01.txt, 02.txt, ...\`

Good luck creating your COMMIT problem! 🚀
EOF

echo "Problem structure created successfully!"
echo
echo "Directory: $PROBLEM_DIR"
echo "Next steps:"
echo "1. cd $PROBLEM_DIR"
echo "2. Edit statement.md with your problem description"
echo "3. Implement solution.cpp"
echo "4. Add test cases in tests/ directory"
echo "5. Test with: ../../scripts/test_problem.sh ."