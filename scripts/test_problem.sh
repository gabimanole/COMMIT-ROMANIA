#!/bin/bash

# COMMIT Romania - Test Runner Script
# This script runs test cases for a given problem

if [ $# -lt 1 ]; then
    echo "Usage: $0 <problem-directory> [solution-file]"
    echo "Example: $0 examples/sum-problem"
    echo "Example: $0 examples/sum-problem my_solution.cpp"
    exit 1
fi

PROBLEM_DIR="$1"
SOLUTION_FILE="${2:-solution.cpp}"

if [ ! -d "$PROBLEM_DIR" ]; then
    echo "Error: Problem directory '$PROBLEM_DIR' not found"
    exit 1
fi

if [ ! -f "$PROBLEM_DIR/$SOLUTION_FILE" ]; then
    echo "Error: Solution file '$PROBLEM_DIR/$SOLUTION_FILE' not found"
    exit 1
fi

echo "Testing problem: $(basename "$PROBLEM_DIR")"
echo "Solution file: $SOLUTION_FILE"
echo "=================================="

# Compile the solution
echo "Compiling solution..."
cd "$PROBLEM_DIR"
g++ -o solution "$SOLUTION_FILE" -std=c++17 -O2

if [ $? -ne 0 ]; then
    echo "Compilation failed!"
    exit 1
fi

echo "Compilation successful!"
echo

# Run test cases
PASSED=0
TOTAL=0
INPUT_DIR="tests/input"
OUTPUT_DIR="tests/output"

if [ ! -d "$INPUT_DIR" ] || [ ! -d "$OUTPUT_DIR" ]; then
    echo "Error: Test directories not found"
    exit 1
fi

for input_file in "$INPUT_DIR"/*.txt; do
    if [ ! -f "$input_file" ]; then
        continue
    fi
    
    test_name=$(basename "$input_file" .txt)
    output_file="$OUTPUT_DIR/$test_name.txt"
    
    if [ ! -f "$output_file" ]; then
        echo "Warning: Expected output file '$output_file' not found"
        continue
    fi
    
    echo -n "Test $test_name: "
    TOTAL=$((TOTAL + 1))
    
    # Run the solution with timeout
    if command -v timeout >/dev/null 2>&1; then
        timeout 2s ./solution < "$input_file" > temp_output.txt 2>/dev/null
        EXIT_CODE=$?
    else
        ./solution < "$input_file" > temp_output.txt 2>/dev/null
        EXIT_CODE=$?
    fi
    
    if [ $EXIT_CODE -eq 124 ]; then
        echo "TIME LIMIT EXCEEDED"
    elif [ $EXIT_CODE -ne 0 ]; then
        echo "RUNTIME ERROR (exit code: $EXIT_CODE)"
    else
        # Compare output
        if cmp -s temp_output.txt "$output_file"; then
            echo "PASSED"
            PASSED=$((PASSED + 1))
        else
            echo "WRONG ANSWER"
            echo "  Expected:"
            cat "$output_file" | sed 's/^/    /'
            echo "  Got:"
            cat temp_output.txt | sed 's/^/    /'
        fi
    fi
    
    rm -f temp_output.txt
done

# Clean up
rm -f solution

echo
echo "Results: $PASSED/$TOTAL tests passed"

if [ $PASSED -eq $TOTAL ]; then
    echo "All tests passed! ✅"
    exit 0
else
    echo "Some tests failed! ❌"
    exit 1
fi