#!/bin/bash
if [ "$#" -lt 1 ]
then
        echo "Usage: $0 <db_username><mysql_password><db_name>";
        exit 0;
fi

for file in $(find ./sqlScripts -type f); do
    cat "$file" | mysql -u "$1" -p"$2" "$3";
done
