#!/bin/bash

YELLOW="\033[0;33m"
COLOR_RESET="\033[0;0m"

# Function to prompt the user for yes or no
confirm() {
  echo -e "* ${YELLOW}NOTE${COLOR_RESET}: other programs/services cannot be currently using the database. Please stop other uses of the database before trying to delete it."
  echo ""
    while true; do
        read -p "Are you sure you want to delete the entire database and it's data? (y / n): " yn
        case $yn in
            [Yy]* ) return 0;;  # User answered yes
            [Nn]* ) return 1;;  # User answered no
            * ) echo "Please answer y or n.";;
        esac
    done
}

# Call the confirm function
if confirm; then
    echo "Deleting the aircraft_tracker database..."
    dropdb --if-exists aircraft_tracker
else
    echo "Script execution cancelled."
fi