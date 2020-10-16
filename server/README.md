# Vision Health Task

### Run (Server)

- Navigate to the vision-health-task/server directory
- `npm i`
- `node server`

## Endpoints

- Rest API: http://localhost:5000

## Routes

`http://localhost:<port>/car/<NumberPlate>`

Given a number plate, get the car's details.

Example:

```
output :
        {
            'color': 'Green',
            'type': 'Hatchback',
        }
```

`http://localhost:<port>/person/<id>/car`

Given a person'd ID, get details of all their cars.

Example:

```
output :
        [
            {
                'color': 'green',
                'type': 'Hatchback',
            },
            {
                'color': 'Silver',
                'type': 'Sedan',
            }
        ]
```

`http://localhost:<port>/getPersonsByCar?color=green`

Given a car color, get names of all persons having a car of that color.

Example:

```
output :
        [
           "Kieron Pollard",
           "Alastair Cook"
        ]
```

`http://localhost:<port>/getPersonsOlderThan?age=25`

Given an age, get names of all the people who are older than that age.

Example:

```
output :
        [
           "Kieron Pollard",
           "Alastair Cook"
        ]
```

`http://localhost:<port>/getPersonsWithInsurance`

Get names of people who have "at least one of their cars insured".

Example:

```
output :
        [
           "Kieron Pollard",
           "Alastair Cook"
        ]
```
