## Astrologer flow distribution

I have used MVC frame work to complete this project

## Installation

Install my-project with npm

```bash
  git clone https://github.com/amit-vis/Astrologer_flow_distribution.git
  npm install
  cd Astrologer_flow_distribution
```
    
## Running Tests

To run tests, run the following command

```bash
  npm start
```

## Endpoints and Actions:
/user/create[post]: Create a new user
/astrologer/create[post]: Create a new astrologer,
/flow/allocate[post]: allocate the user to the astrologer.
/flow/adjust[post]: adjust the user allocation for to astrologer


## Folder Structure


* config
    - database.js
* controllers
    - astrologer_controller.js
    - users_controller.js
    - flowDistributionalgo_controller.js
* model
    - astrologers.js
    - users.js
* routes
    - astrologer.js
    - index.js
    - flowAlgo.js
    - user.js
* services
    - flowDistribution.js
* test
    - adjustFloDistribution.test.js
    - allocateflowDistribution.test.js
- .gitignore
- index.js
- package-lock.json
- package.json
