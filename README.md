This project lets you to move files from one folder to another based on a pattern.

Usage:

If you want to move files in a folder which has 10000 files and don't want to get on hassle with sorting things,
you can use this to easily transfer files from one folder to other based on the pattern.

You have to pass the src folder path in first argument and 
dest folder path in second argument. The third argument would be the string to match.


/Users/aadharsh/Downloads/ - argv[2]

/Users/aadharsh/Movies/ - argv[3]

.mp4 - argv[4]

node index.js /Users/aadharsh/Downloads/ 
/Users/aadharsh/Movies/ .mp4

This will move all the mp4 to Movies folder without you having to manually copy all the mp4s.