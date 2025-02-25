#!/bin/sh

# Define the directory name
DIR="diceRoulette"

# Check if the directory exists
if [ -d "$DIR" ]; then
    # If it exists, delete it and all its contents
    sudo rm -rf "$DIR"
fi

# Clone the repository into a new directory
git clone git@github.com:ims-kss/js-wuerfel-poker-SageTheDM.git "$DIR"

# Change to the new directory
cd "$DIR" || exit

# Remove the .git directory and README.md file
sudo rm -rf .git 
sudo rm -rf README.md
