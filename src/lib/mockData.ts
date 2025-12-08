
// News Interface matching src/pages/News.tsx
export interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    featured: boolean;
    image: string | null;
    created_at: string;
}

export const initialNews: NewsItem[] = [
    {
        id: '1',
        title: 'EKUSA Cultural Week 2025 Announced',
        excerpt: 'Join us for a week of celebrating our diverse cultures and traditions.',
        content: 'We are excited to announce the dates for the 2025 Cultural Week. It will feature traditional dances, food festivals, and fashion shows. All students are invited to participate and showcase their cultural heritage.',
        image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80',
        created_at: '2025-03-15T10:00:00Z',
        author: 'EKUSA Admin',
        category: 'Events',
        featured: true
    },
    {
        id: '2',
        title: 'New Student Leadership Council Elected',
        excerpt: 'Meet your new student representatives for the 2025/2026 academic year.',
        content: 'The results are in! After a rigorous campaign period, the student body has spoken. We congratulate the incoming leaders who will represent the student voice for the next academic year.',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80',
        created_at: '2025-02-28T14:30:00Z',
        author: 'Electoral Commission',
        category: 'Achievement',
        featured: false
    },
    {
        id: '3',
        title: 'Scholarship Opportunities Open',
        excerpt: 'Applications for the Vice Chancellor\'s Scholarship are now open.',
        content: 'We are pleased to announce that applications for the annual VC Scholarship are now open. Eligible students are encouraged to apply before the deadline.',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
        created_at: '2025-04-01T09:00:00Z',
        author: 'Dean of Students',
        category: 'Scholarship',
        featured: false
    }
];

// Event Interface matching src/pages/Events.tsx
export interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    event_time: string | null;
    location: string;
    type: string;
    expected_attendees: number;
    actual_attendees: number;
    is_past: boolean;
    images: string[] | null;
    highlight: string | null;
    created_at: string;
}

export const initialEvents: Event[] = [
    {
        id: '1',
        title: 'Annual Tech Hackathon',
        description: 'A 24-hour coding challenge to solve campus problems.',
        event_date: '2025-04-10',
        event_time: '09:00 AM',
        location: 'Computer Lab 3',
        type: 'Workshop',
        expected_attendees: 50,
        actual_attendees: 0,
        is_past: false,
        images: ['https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80'],
        highlight: null,
        created_at: '2025-03-01T10:00:00Z'
    },
    {
        id: "2",
        title: "Charity Fun Run",
        description: "Running for a cause - supporting local children's homes.",
        event_date: "2025-05-01",
        event_time: "07:30 AM",
        location: "Main Sports Field",
        type: "Charity",
        expected_attendees: 200,
        actual_attendees: 0,
        is_past: false,
        images: ["https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80"],
        highlight: null,
        created_at: '2025-03-05T11:00:00Z'
    },
    {
        id: "3",
        title: "Freshmen Orientation Hike",
        description: "A hike to Mt. Kenya regions to welcome new students.",
        event_date: "2024-09-15",
        event_time: "06:00 AM",
        location: "Mt. Kenya",
        type: "Adventure",
        expected_attendees: 100,
        actual_attendees: 120,
        is_past: true,
        images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"],
        highlight: "Reached the base camp successfully!",
        created_at: '2024-08-20T10:00:00Z'
    }
];

export interface Member {
    id: string;
    name: string;
    registration_number: string;
    email: string;
    phone_number: string;
    course: string;
    year_of_study: string;
    status: string;
}

export const initialMembers: Member[] = [
    {
        id: '1',
        name: 'John Doe',
        registration_number: 'B123-01-0001/2021',
        email: 'john.doe@student.ekusa.com',
        phone_number: '+254700000000',
        course: 'Computer Science',
        year_of_study: '4',
        status: 'Active'
    },
    {
        id: '2',
        name: 'Jane Smith',
        registration_number: 'B123-01-0002/2021',
        email: 'jane.smith@student.ekusa.com',
        phone_number: '+254700000001',
        course: 'Education',
        year_of_study: '3',
        status: 'Active'
    }
];

// Simple local storage helper
export const getLocalData = <T>(key: string, initial: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) {
            localStorage.setItem(key, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(stored);
    } catch (e) {
        console.error("Error accessing localStorage", e);
        return initial;
    }
};

export const setLocalData = <T>(key: string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
};
