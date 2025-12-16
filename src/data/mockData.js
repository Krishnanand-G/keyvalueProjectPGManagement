export const mockTenantProfile = {
    name: "John Doe",
    age: 24,
    phone: "+1 234-567-8900",
    roomNumber: "101"
};

export const mockRoommates = [
    { id: 1, name: "Jane Smith", age: 23 },
    { id: 2, name: "Mike Johnson", age: 25 },
    { id: 3, name: "Sarah Williams", age: 22 }
];

export const mockAlerts = [
    {
        id: 1,
        type: "warning",
        message: "Rent due for March",
        date: "2025-03-01"
    },
    {
        id: 2,
        type: "success",
        message: "Complaint resolved",
        date: "2025-02-28"
    },
    {
        id: 3,
        type: "info",
        message: "Maintenance scheduled for next week",
        date: "2025-03-05"
    }
];

export const mockRooms = [
    {
        id: 1,
        roomNumber: "101",
        maxOccupancy: 4,
        currentOccupancy: 3,
        tenants: [
            { id: 1, name: "John Doe", age: 24, phone: "+1 234-567-8900" },
            { id: 2, name: "Jane Smith", age: 23, phone: "+1 234-567-8901" },
            { id: 3, name: "Mike Johnson", age: 25, phone: "+1 234-567-8902" }
        ]
    },
    {
        id: 2,
        roomNumber: "102",
        maxOccupancy: 4,
        currentOccupancy: 4,
        tenants: [
            { id: 4, name: "Sarah Williams", age: 22, phone: "+1 234-567-8903" },
            { id: 5, name: "Tom Brown", age: 24, phone: "+1 234-567-8904" },
            { id: 6, name: "Emily Davis", age: 23, phone: "+1 234-567-8905" },
            { id: 7, name: "Chris Wilson", age: 25, phone: "+1 234-567-8906" }
        ]
    },
    {
        id: 3,
        roomNumber: "103",
        maxOccupancy: 2,
        currentOccupancy: 1,
        tenants: [
            { id: 8, name: "Lisa Anderson", age: 26, phone: "+1 234-567-8907" }
        ]
    },
    {
        id: 4,
        roomNumber: "104",
        maxOccupancy: 4,
        currentOccupancy: 2,
        tenants: [
            { id: 9, name: "David Martinez", age: 27, phone: "+1 234-567-8908" },
            { id: 10, name: "Anna Taylor", age: 24, phone: "+1 234-567-8909" }
        ]
    },
    {
        id: 5,
        roomNumber: "105",
        maxOccupancy: 3,
        currentOccupancy: 0,
        tenants: []
    },
    {
        id: 6,
        roomNumber: "106",
        maxOccupancy: 4,
        currentOccupancy: 3,
        tenants: [
            { id: 11, name: "Kevin Lee", age: 23, phone: "+1 234-567-8910" },
            { id: 12, name: "Rachel Green", age: 25, phone: "+1 234-567-8911" },
            { id: 13, name: "Matt Miller", age: 22, phone: "+1 234-567-8912" }
        ]
    }
];
