# Entities

```plantuml
@startuml
class Customer {
    id: string
    name: string
    email: string
    birthdate: Date
}

class Movie {
    id: string
    title: string
    genre: string[]
    releaseDate: Date
    plot: string
    durationMinutes : number
    director: string
    rating: string
}

class Theater{
    id:string
    name:string
    latlong: LatLong
    seatmap:Seatmap
}
note left
Seatmap {
    blocks:[{
            name: 'A',
            rows:[ {  name: '1', seats: 'OOOOXXOOOO' } ]
        }]
}
end note

class Showtime {
    id: ObjectId
    startTime: Date
    endTime: Date
    theaterId: ObjectId
    movieId: ObjectId
    transactionId:ObjectId
}

class Ticket {
    id: ObjectId
    showtimeId: ObjectId
    seat:Seat
    status: TicketStatus
}

note left
enum TicketStatus {
    open, reserved, sold
}

Seat {
    block: string
    row: string
    seatnum: number
}
end note

Showtime "1" --> "*" Ticket
Movie "1" --> "*" Showtime
Theater "1" --> "*" Showtime
Ticket "*" --> "1" Customer
@enduml
```
