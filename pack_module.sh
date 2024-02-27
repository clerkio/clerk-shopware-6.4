#!/bin/bash

# Set the name of the zip file
root_folder="clerkio64"
zip_file="$root_folder.zip"

# Create a temporary directory
temp_dir=$(mktemp -d)
orig_dir=$(realpath $(dirname $0))

rm -rf "./$zip_file"

# Create a parent folder named 'clerk' in the temporary directory and copy the contents into it
mkdir "$temp_dir/$root_folder" && cp -r * "$temp_dir/$root_folder"

cd "$temp_dir"

# Zip the 'clerk' folder
zip -r "$zip_file" "$root_folder"

mv "$zip_file" "$orig_dir/$zip_file"

echo "Packed Shopware6 Module"
ls | grep "*.zip"

# Clean up by removing the temporary directory
rm -rf "$temp_dir"
