#!/bin/bash

# COMMIT Romania - Problem Validator
# This script validates that a problem follows the standard format

if [ $# -lt 1 ]; then
    echo "Usage: $0 <problem-directory>"
    echo "Example: $0 examples/sum-problem"
    exit 1
fi

PROBLEM_DIR="$1"

if [ ! -d "$PROBLEM_DIR" ]; then
    echo "Error: Problem directory '$PROBLEM_DIR' not found"
    exit 1
fi

echo "Validating problem: $(basename "$PROBLEM_DIR")"
echo "=================================="

ERRORS=0

# Check required files
echo "Checking required files..."

REQUIRED_FILES=("statement.md" "solution.cpp" "constraints.txt")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$PROBLEM_DIR/$file" ]; then
        echo "❌ Missing required file: $file"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ Found: $file"
    fi
done

# Check directory structure
echo
echo "Checking directory structure..."

REQUIRED_DIRS=("tests" "tests/input" "tests/output")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$PROBLEM_DIR/$dir" ]; then
        echo "❌ Missing required directory: $dir"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ Found: $dir"
    fi
done

# Check test cases
echo
echo "Checking test cases..."

INPUT_DIR="$PROBLEM_DIR/tests/input"
OUTPUT_DIR="$PROBLEM_DIR/tests/output"

if [ -d "$INPUT_DIR" ] && [ -d "$OUTPUT_DIR" ]; then
    INPUT_COUNT=$(find "$INPUT_DIR" -name "*.txt" | wc -l)
    OUTPUT_COUNT=$(find "$OUTPUT_DIR" -name "*.txt" | wc -l)
    
    echo "Input files: $INPUT_COUNT"
    echo "Output files: $OUTPUT_COUNT"
    
    if [ $INPUT_COUNT -eq 0 ]; then
        echo "❌ No input test files found"
        ERRORS=$((ERRORS + 1))
    elif [ $INPUT_COUNT -lt 3 ]; then
        echo "⚠️  Warning: Less than 3 test cases (recommended minimum)"
    fi
    
    if [ $INPUT_COUNT -ne $OUTPUT_COUNT ]; then
        echo "❌ Mismatch between input and output file counts"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check file naming
    for input_file in "$INPUT_DIR"/*.txt; do
        if [ ! -f "$input_file" ]; then
            continue
        fi
        
        filename=$(basename "$input_file")
        output_file="$OUTPUT_DIR/$filename"
        
        if [ ! -f "$output_file" ]; then
            echo "❌ Missing output file for: $filename"
            ERRORS=$((ERRORS + 1))
        fi
    done
fi

# Check solution compilation
echo
echo "Checking solution compilation..."

cd "$PROBLEM_DIR"
if g++ -o temp_solution solution.cpp -std=c++17 -O2 2>/dev/null; then
    echo "✅ Solution compiles successfully"
    rm -f temp_solution
else
    echo "❌ Solution compilation failed"
    ERRORS=$((ERRORS + 1))
fi

# Summary
echo
echo "Validation Summary"
echo "=================="

if [ $ERRORS -eq 0 ]; then
    echo "✅ Problem validation passed! No errors found."
    echo "Ready to test with: ../../scripts/test_problem.sh ."
    exit 0
else
    echo "❌ Problem validation failed with $ERRORS error(s)."
    echo "Please fix the issues above before testing."
    exit 1
fi