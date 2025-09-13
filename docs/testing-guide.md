# Testing Guide

This guide explains how to test problems and solutions in the COMMIT Romania project.

## Automated Testing

### Using the Test Script

The project includes an automated testing script that can validate solutions against test cases:

```bash
# Test a problem with its default solution
./scripts/test_problem.sh examples/sum-problem

# Test a problem with a custom solution
./scripts/test_problem.sh examples/sum-problem my_solution.cpp
```

### Test Output

The script provides detailed feedback:
- **PASSED**: Test case passed
- **WRONG ANSWER**: Output doesn't match expected result
- **RUNTIME ERROR**: Solution crashed or returned non-zero exit code
- **TIME LIMIT EXCEEDED**: Solution took too long (>2 seconds)

## Manual Testing

### Compile and Run

```bash
cd examples/sum-problem
g++ -o solution solution.cpp -std=c++17 -O2
./solution < tests/input/01.txt
```

### Compare Output

```bash
./solution < tests/input/01.txt > my_output.txt
diff my_output.txt tests/output/01.txt
```

## Test Case Requirements

### File Naming

- Input files: `01.txt`, `02.txt`, ..., `10.txt`
- Output files: Must match input file names
- Use zero-padded numbers for proper sorting

### Test Categories

1. **Sample cases (01-02)**: From problem statement
2. **Edge cases (03-05)**: Boundary conditions
3. **General cases (06-10)**: Various inputs

### Quality Guidelines

- Cover all edge cases (minimum, maximum values)
- Include corner cases (empty input, single element)
- Test different scenarios mentioned in the problem
- Ensure output format is exactly correct (including whitespace)

## Debugging Failed Tests

### Wrong Answer
1. Check output format (extra spaces, missing newlines)
2. Verify algorithm logic
3. Test with additional custom inputs
4. Use print statements to debug

### Runtime Error
1. Check array bounds
2. Look for division by zero
3. Verify input parsing
4. Check for infinite loops

### Time Limit Exceeded
1. Analyze algorithm complexity
2. Optimize bottleneck operations
3. Consider better algorithms
4. Check for infinite loops

## Best Practices

- Always test with the automated script before submission
- Create comprehensive test cases
- Test edge cases thoroughly
- Verify output format exactly matches expected format
- Use the same compiler settings as the test script