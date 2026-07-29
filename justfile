# Odia chatbot — task runner
# Run `just` to list available recipes.

# npm is the package manager (package-lock.json present)
pm := "npm"

# List available recipes
default:
    @just --list

# Install dependencies
install:
    {{pm}} install

# Start the Vite dev server
dev:
    {{pm}} run dev

# Build the production bundle
build:
    {{pm}} run build

# Preview the production build locally
preview: build
    {{pm}} run preview

# Lint the source
lint:
    {{pm}} run lint

# Remove build output and installed dependencies
clean:
    rm -rf dist node_modules
