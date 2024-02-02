## Installation

I have not tested it on Windows, but the process should be similar. To get the application to work, the following need to be installed, and set up properly.

- Redis
- InDesign Server
- Node

### Redis

Download and install Redis here.

[https://redis.io/](https://redis.io/)

### InDesign Server

InDesign Server must be installed, and running on port `:18383`

### Node

Clone the GitHub repository, and run the `npm i` command on each of these subfolders:

- `/`
- `/inds-backend`
- `/inds-frontend`

Create a file named `.env` in the `/inds-backend` folder, and set it’s contents to:

```json
SERVER_PATH="/Path/To/Upload/Folder/"
SCRIPT_PATH="/Path/To/InDesign/Scripts/indsExample.jsx"
```

But use a path on your computer to point to existing files/folders.

`SERVER_PATH` is the folder where the application will upload the .zip files to.

`SCRIPT_PATH` is the .jsx file that InDesign Server will run. This file is included in the repo.


### Running

To run the app, use command `npm start` on the root (`/`) folder.

Redis will be running on it’s default port, which in my case is `:6379` . You can access it by running `redis-cli` in a terminal window. The command `flushall` will empty the job queue.
