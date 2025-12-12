module.exports = [
"[project]/src/lib/utils/cn.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.3.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/api/domains/staff/staff-dashboard/fetchers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffDashboardFetchers",
    ()=>staffDashboardFetchers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/routes.ts [app-ssr] (ecmascript)");
;
;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
// Mock data
const mockDashboardSummary = {
    todayJobs: 8,
    weekJobs: 42,
    earnings: 15680,
    rating: 4.8,
    statsTrends: {
        todayJobs: '+2',
        weekJobs: '+12%',
        earnings: '+₹2,340',
        rating: '+0.2'
    }
};
const mockUpcomingJobs = [
    {
        id: 'JOB001',
        service: 'Premium Car Wash',
        customer: 'Rajesh Kumar',
        time: '10:00 AM',
        datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Koramangala, Bangalore',
        status: 'confirmed',
        amount: 599
    },
    {
        id: 'JOB002',
        service: 'Interior Detailing',
        customer: 'Priya Sharma',
        time: '12:30 PM',
        datetime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
        location: 'Indiranagar, Bangalore',
        status: 'confirmed',
        amount: 899
    },
    {
        id: 'JOB003',
        service: 'Bike Wash',
        customer: 'Amit Patel',
        time: '2:00 PM',
        datetime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        location: 'HSR Layout, Bangalore',
        status: 'pending',
        amount: 199
    },
    {
        id: 'JOB004',
        service: 'Full Service',
        customer: 'Sneha Reddy',
        time: '4:30 PM',
        datetime: new Date(Date.now() + 8.5 * 60 * 60 * 1000).toISOString(),
        location: 'Whitefield, Bangalore',
        status: 'confirmed',
        amount: 1299
    }
];
const staffDashboardFetchers = {
    async getDashboardSummary () {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            return mockDashboardSummary;
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].DASHBOARD + '/summary');
        return data.data;
    },
    async getUpcomingJobs () {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            return mockUpcomingJobs;
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].JOBS + '/upcoming');
        return data.data;
    }
};
}),
"[project]/src/api/domains/staff/staff-dashboard/queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffDashboardKeys",
    ()=>staffDashboardKeys,
    "useStaffDashboardSummary",
    ()=>useStaffDashboardSummary,
    "useStaffUpcomingJobs",
    ()=>useStaffUpcomingJobs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$dashboard$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-dashboard/fetchers.ts [app-ssr] (ecmascript)");
;
;
const staffDashboardKeys = {
    all: [
        'staff-dashboard'
    ],
    summary: ()=>[
            ...staffDashboardKeys.all,
            'summary'
        ],
    upcomingJobs: ()=>[
            ...staffDashboardKeys.all,
            'upcoming-jobs'
        ]
};
const useStaffDashboardSummary = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffDashboardKeys.summary(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$dashboard$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffDashboardFetchers"].getDashboardSummary,
        staleTime: 2 * 60 * 1000
    });
};
const useStaffUpcomingJobs = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffDashboardKeys.upcomingJobs(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$dashboard$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffDashboardFetchers"].getUpcomingJobs,
        staleTime: 1 * 60 * 1000
    });
};
}),
"[project]/src/lib/constants/status.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// Status Constants
// ============================================
__turbopack_context__.s([
    "BOOKING_STATUS",
    ()=>BOOKING_STATUS,
    "CAMPAIGN_TYPE",
    ()=>CAMPAIGN_TYPE,
    "COD_PAYMENT_STATUS",
    ()=>COD_PAYMENT_STATUS,
    "DISCOUNT_TYPE",
    ()=>DISCOUNT_TYPE,
    "FEEDBACK_STATUS",
    ()=>FEEDBACK_STATUS,
    "ORDER_STATUS",
    ()=>ORDER_STATUS,
    "PAYMENT_METHOD",
    ()=>PAYMENT_METHOD,
    "PAYMENT_STATUS",
    ()=>PAYMENT_STATUS,
    "PRIORITY",
    ()=>PRIORITY,
    "SENDER_TYPE",
    ()=>SENDER_TYPE,
    "STAFF_ROLE",
    ()=>STAFF_ROLE,
    "TARGET_AUDIENCE",
    ()=>TARGET_AUDIENCE,
    "TICKET_STATUS",
    ()=>TICKET_STATUS,
    "USER_ROLE",
    ()=>USER_ROLE
]);
const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};
const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    CONFIRMED: 'confirmed',
    PACKED: 'packed',
    SHIPPED: 'shipped',
    OUT_FOR_DELIVERY: 'out-for-delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
};
const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIAL: 'partial'
};
const TICKET_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
};
const FEEDBACK_STATUS = {
    PENDING: 'pending',
    REVIEWED: 'reviewed',
    RESOLVED: 'resolved'
};
const COD_PAYMENT_STATUS = {
    PENDING: 'pending',
    COLLECTED: 'collected',
    DEPOSITED: 'deposited',
    VERIFIED: 'verified'
};
const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};
const USER_ROLE = {
    CUSTOMER: 'customer',
    STAFF: 'staff',
    ADMIN: 'admin'
};
const STAFF_ROLE = {
    MANAGER: 'manager',
    CLEANER: 'cleaner',
    DRIVER: 'driver'
};
const SENDER_TYPE = {
    USER: 'user',
    CUSTOMER: 'customer',
    STAFF: 'staff',
    ADMIN: 'admin',
    SUPPORT: 'support'
};
const PAYMENT_METHOD = {
    CARD: 'card',
    UPI: 'upi',
    WALLET: 'wallet',
    NETBANKING: 'netbanking',
    COD: 'cod',
    ONLINE: 'online'
};
const CAMPAIGN_TYPE = {
    EMAIL: 'email',
    SMS: 'sms',
    NOTIFICATION: 'notification',
    BANNER: 'banner'
};
const TARGET_AUDIENCE = {
    ALL: 'all',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    NEW: 'new'
};
const DISCOUNT_TYPE = {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed'
};
}),
"[project]/src/api/domains/staff/staff-jobs/fetchers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffJobsFetchers",
    ()=>staffJobsFetchers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/routes.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/status.ts [app-ssr] (ecmascript)");
;
;
;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
// Mock data
const mockJobs = [
    {
        id: 'JOB001',
        service: 'Premium Car Wash',
        customer: 'Rajesh Kumar',
        time: '10:00 AM',
        datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Koramangala',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].CONFIRMED,
        amount: 599
    },
    {
        id: 'JOB002',
        service: 'Interior Detailing',
        customer: 'Priya Sharma',
        time: '12:30 PM',
        datetime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
        location: 'Indiranagar',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].CONFIRMED,
        amount: 899
    },
    {
        id: 'JOB003',
        service: 'Bike Wash',
        customer: 'Amit Patel',
        time: '2:00 PM',
        datetime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        location: 'HSR Layout',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].PENDING,
        amount: 199
    },
    {
        id: 'JOB004',
        service: 'Full Service',
        customer: 'Sneha Reddy',
        time: '4:30 PM',
        datetime: new Date(Date.now() + 8.5 * 60 * 60 * 1000).toISOString(),
        location: 'Whitefield',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].IN_PROGRESS,
        amount: 1299
    },
    {
        id: 'JOB005',
        service: 'Express Wash',
        customer: 'Vikram Singh',
        time: '5:00 PM',
        datetime: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(),
        location: 'BTM Layout',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].CONFIRMED,
        amount: 399
    }
];
const mockJobDetails = {
    JOB001: {
        id: 'JOB001',
        service: 'Premium Car Wash',
        customer: {
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210'
        },
        datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].CONFIRMED,
        notes: [
            'Customer prefers eco-friendly products',
            'Focus on exterior shine'
        ],
        location: 'Koramangala 5th Block, Bangalore',
        amount: 599,
        vehicleDetails: {
            type: 'Car',
            model: 'Honda City 2020',
            number: 'KA-01-AB-1234'
        },
        paymentInfo: {
            method: 'Online',
            status: 'Paid',
            amount: 599
        },
        statusHistory: [
            {
                status: 'Confirmed',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                note: 'Job confirmed by customer'
            }
        ]
    }
};
const mockWorkHistory = [
    {
        id: 'JOB101',
        service: 'Premium Car Wash',
        customer: 'Anita Desai',
        time: '9:00 AM',
        datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'Koramangala',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].COMPLETED,
        amount: 599,
        rating: 5
    },
    {
        id: 'JOB102',
        service: 'Bike Wash',
        customer: 'Ravi Kumar',
        time: '11:00 AM',
        datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'HSR Layout',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].COMPLETED,
        amount: 199,
        rating: 4
    },
    {
        id: 'JOB103',
        service: 'Interior Detailing',
        customer: 'Meera Patel',
        time: '2:00 PM',
        datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'Indiranagar',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].COMPLETED,
        amount: 899,
        rating: 5
    },
    {
        id: 'JOB104',
        service: 'Full Service',
        customer: 'Karthik Reddy',
        time: '4:00 PM',
        datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'Whitefield',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].COMPLETED,
        amount: 1299,
        rating: 4
    },
    {
        id: 'JOB105',
        service: 'Express Wash',
        customer: 'Deepa Singh',
        time: '5:30 PM',
        datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'BTM Layout',
        status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOOKING_STATUS"].COMPLETED,
        amount: 399,
        rating: 5
    }
];
const staffJobsFetchers = {
    async getJobs (filters) {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            let filteredJobs = [
                ...mockJobs
            ];
            // Apply search filter
            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                filteredJobs = filteredJobs.filter((job)=>job.customer.toLowerCase().includes(searchLower) || job.service.toLowerCase().includes(searchLower) || job.location.toLowerCase().includes(searchLower));
            }
            // Apply status filter
            if (filters?.status) {
                filteredJobs = filteredJobs.filter((job)=>job.status === filters.status);
            }
            // Apply date range filters
            if (filters?.fromDate) {
                filteredJobs = filteredJobs.filter((job)=>{
                    const jobDate = job.datetime.split('T')[0];
                    return jobDate >= filters.fromDate;
                });
            }
            if (filters?.toDate) {
                filteredJobs = filteredJobs.filter((job)=>{
                    const jobDate = job.datetime.split('T')[0];
                    return jobDate <= filters.toDate;
                });
            }
            // Apply pagination
            const page = filters?.page || 1;
            const limit = filters?.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
            return {
                data: paginatedJobs,
                total: filteredJobs.length,
                page: page,
                limit: limit,
                totalPages: Math.ceil(filteredJobs.length / limit)
            };
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].JOBS, {
            params: filters
        });
        return data.data;
    },
    async getJobById (jobId) {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 300));
            const jobDetail = mockJobDetails[jobId];
            if (!jobDetail) {
                throw new Error('Job not found');
            }
            return jobDetail;
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].JOB_DETAIL(jobId));
        return data.data;
    },
    async updateJobStatus (jobId, input) {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            const jobDetail = mockJobDetails[jobId];
            if (!jobDetail) {
                throw new Error('Job not found');
            }
            return {
                ...jobDetail,
                status: input.status
            };
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].JOB_DETAIL(jobId), input);
        return data.data;
    },
    async getWorkHistory (filters) {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            let filteredHistory = [
                ...mockWorkHistory
            ];
            // Apply search filter
            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                filteredHistory = filteredHistory.filter((job)=>job.customer.toLowerCase().includes(searchLower) || job.service.toLowerCase().includes(searchLower) || job.location.toLowerCase().includes(searchLower));
            }
            // Apply status filter
            if (filters?.status) {
                filteredHistory = filteredHistory.filter((job)=>job.status === filters.status);
            }
            // Apply date range filters
            if (filters?.fromDate) {
                filteredHistory = filteredHistory.filter((job)=>{
                    const jobDate = job.datetime.split('T')[0];
                    return jobDate >= filters.fromDate;
                });
            }
            if (filters?.toDate) {
                filteredHistory = filteredHistory.filter((job)=>{
                    const jobDate = job.datetime.split('T')[0];
                    return jobDate <= filters.toDate;
                });
            }
            return filteredHistory;
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].HISTORY, {
            params: filters
        });
        return data.data;
    }
};
}),
"[project]/src/api/domains/staff/staff-jobs/queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffJobsKeys",
    ()=>staffJobsKeys,
    "useStaffJobDetail",
    ()=>useStaffJobDetail,
    "useStaffJobs",
    ()=>useStaffJobs,
    "useStaffWorkHistory",
    ()=>useStaffWorkHistory,
    "useUpdateJobStatus",
    ()=>useUpdateJobStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$jobs$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-jobs/fetchers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
;
;
const staffJobsKeys = {
    all: [
        'staff-jobs'
    ],
    list: (filters)=>[
            ...staffJobsKeys.all,
            'list',
            filters
        ],
    detail: (id)=>[
            ...staffJobsKeys.all,
            'detail',
            id
        ],
    history: (filters)=>[
            ...staffJobsKeys.all,
            'history',
            filters
        ]
};
const useStaffJobs = (filters)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffJobsKeys.list(filters),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$jobs$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffJobsFetchers"].getJobs(filters),
        staleTime: 1 * 60 * 1000
    });
};
const useStaffJobDetail = (jobId)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffJobsKeys.detail(jobId),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$jobs$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffJobsFetchers"].getJobById(jobId),
        enabled: !!jobId,
        staleTime: 30 * 1000
    });
};
const useUpdateJobStatus = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ jobId, input })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$jobs$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffJobsFetchers"].updateJobStatus(jobId, input),
        onSuccess: (data, variables)=>{
            queryClient.setQueryData(staffJobsKeys.detail(variables.jobId), data);
            queryClient.invalidateQueries({
                queryKey: staffJobsKeys.all
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Job status updated successfully');
        },
        onError: (error)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Failed to update job status');
        }
    });
};
const useStaffWorkHistory = (filters)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffJobsKeys.history(filters),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$jobs$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffJobsFetchers"].getWorkHistory(filters),
        staleTime: 5 * 60 * 1000
    });
};
}),
"[project]/src/api/domains/staff/staff-profile/fetchers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffProfileFetchers",
    ()=>staffProfileFetchers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/routes.ts [app-ssr] (ecmascript)");
;
;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
// Mock data
const mockProfile = {
    id: 'STAFF001',
    name: 'Ramesh Kumar',
    role: 'Senior Technician',
    phone: '+91 98765 43210',
    email: 'ramesh.kumar@carwash.com',
    area: 'Koramangala & HSR Layout',
    totalJobs: 342,
    avgRating: 4.8,
    earnings: 45680,
    totalReviews: 156,
    avatar: '/images/avatars/staff-avatar.jpg',
    joinedDate: '2023-06-15T00:00:00.000Z',
    achievements: [
        {
            label: 'Top Performer',
            value: 'This Month',
            icon: '🏆'
        },
        {
            label: 'Customer Favorite',
            value: '4.8 Rating',
            icon: '⭐'
        },
        {
            label: 'Quick Service',
            value: 'Avg 45 min',
            icon: '⚡'
        },
        {
            label: 'Eco Warrior',
            value: '100% Green',
            icon: '🌿'
        }
    ],
    skills: [
        'Premium Detailing',
        'Interior Cleaning',
        'Waxing & Polishing',
        'Bike Washing',
        'Eco-Friendly Products'
    ],
    availability: {
        days: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        hours: '9:00 AM - 6:00 PM'
    }
};
const mockNotifications = [
    {
        id: 'NOTIF001',
        title: 'New Job Assigned',
        message: 'Premium Car Wash at Koramangala scheduled for 10:00 AM today',
        type: 'job_assigned',
        data: {
            jobId: 'JOB001'
        },
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
        id: 'NOTIF002',
        title: 'Payment Received',
        message: 'You received ₹1,798 for completed jobs',
        type: 'payment',
        data: {
            amount: 1798
        },
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'NOTIF003',
        title: '5-Star Rating!',
        message: 'Customer Anita Desai gave you 5 stars for excellent service',
        type: 'rating',
        data: {
            rating: 5,
            jobId: 'JOB101'
        },
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'NOTIF004',
        title: 'Job Cancelled',
        message: 'Job JOB203 has been cancelled by the customer',
        type: 'job_cancelled',
        data: {
            jobId: 'JOB203'
        },
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'NOTIF005',
        title: 'System Update',
        message: 'New features added to the staff app. Check them out!',
        type: 'system',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
];
const staffProfileFetchers = {
    async getProfile () {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            return mockProfile;
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].PROFILE);
        return data.data;
    },
    async updateProfile (input) {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            return {
                ...mockProfile,
                ...input,
                availability: input.availability ? {
                    days: input.availability.days || mockProfile.availability.days,
                    hours: input.availability.hours || mockProfile.availability.hours
                } : mockProfile.availability
            };
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].PROFILE, input);
        return data.data;
    },
    async logout () {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 300));
            // Clear cookies
            if (typeof document !== 'undefined') {
                document.cookie = 'auth_token=; path=/; max-age=0';
                document.cookie = 'auth_role=; path=/; max-age=0';
            }
            return {
                message: 'Logged out successfully'
            };
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CustomerRoutes"].AUTH_LOGOUT);
        return data.data;
    },
    async getNotifications () {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 300));
            return mockNotifications;
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].NOTIFICATIONS);
        return data.data;
    },
    async markNotificationAsRead (notificationId) {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 200));
            const notification = mockNotifications.find((n)=>n.id === notificationId);
            if (notification) {
                notification.read = true;
            }
            return {
                message: 'Notification marked as read'
            };
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].MARK_NOTIFICATION_AS_READ, {
            notificationId
        });
        return data.data;
    }
};
}),
"[project]/src/api/domains/staff/staff-profile/queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffProfileKeys",
    ()=>staffProfileKeys,
    "useMarkStaffNotificationAsRead",
    ()=>useMarkStaffNotificationAsRead,
    "useStaffLogout",
    ()=>useStaffLogout,
    "useStaffNotifications",
    ()=>useStaffNotifications,
    "useStaffProfile",
    ()=>useStaffProfile,
    "useUpdateStaffProfile",
    ()=>useUpdateStaffProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-profile/fetchers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_@babel+core@7.28.5_babel-plugin-react-compiler@1.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$authState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/state/authState.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/routes.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const staffProfileKeys = {
    all: [
        'staff-profile'
    ],
    profile: ()=>[
            ...staffProfileKeys.all,
            'profile'
        ],
    notifications: ()=>[
            ...staffProfileKeys.all,
            'notifications'
        ]
};
const useStaffProfile = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffProfileKeys.profile(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffProfileFetchers"].getProfile,
        staleTime: 5 * 60 * 1000
    });
};
const useUpdateStaffProfile = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (input)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffProfileFetchers"].updateProfile(input),
        onSuccess: (data)=>{
            queryClient.setQueryData(staffProfileKeys.profile(), data);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Profile updated successfully');
        },
        onError: (error)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(error.message || 'Failed to update profile');
        }
    });
};
const useStaffLogout = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffProfileFetchers"].logout,
        onSuccess: ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$state$2f$authState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(null);
            queryClient.clear();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Logged out successfully');
            router.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].LOGIN);
        }
    });
};
const useStaffNotifications = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffProfileKeys.notifications(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffProfileFetchers"].getNotifications,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000
    });
};
const useMarkStaffNotificationAsRead = ()=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (notificationId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffProfileFetchers"].markNotificationAsRead(notificationId),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: staffProfileKeys.notifications()
            });
        }
    });
};
}),
"[project]/src/api/domains/staff/staff-payments/fetchers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffPaymentsFetchers",
    ()=>staffPaymentsFetchers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/routes.ts [app-ssr] (ecmascript)");
;
;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
// Mock data
const mockPaymentSummary = {
    totalEarnings: 45680,
    thisWeek: 8920,
    pendingPayments: 2340,
    history: [
        {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 1798,
            jobId: 'JOB101',
            service: 'Premium Car Wash + Interior Detailing'
        },
        {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 1498,
            jobId: 'JOB102',
            service: 'Full Service + Waxing'
        },
        {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 1299,
            jobId: 'JOB103',
            service: 'Full Service'
        },
        {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 899,
            jobId: 'JOB104',
            service: 'Interior Detailing'
        },
        {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 599,
            jobId: 'JOB105',
            service: 'Premium Car Wash'
        },
        {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 399,
            jobId: 'JOB106',
            service: 'Express Wash'
        },
        {
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 199,
            jobId: 'JOB107',
            service: 'Bike Wash'
        },
        {
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 799,
            jobId: 'JOB108',
            service: 'Interior + Exterior Detailing'
        },
        {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 599,
            jobId: 'JOB109',
            service: 'Premium Car Wash'
        },
        {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 399,
            jobId: 'JOB110',
            service: 'Express Wash'
        }
    ]
};
const staffPaymentsFetchers = {
    async getPaymentSummary () {
        if (USE_MOCK_DATA) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            return mockPaymentSummary;
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].PAYMENTS + '/summary');
        return data.data;
    }
};
}),
"[project]/src/api/domains/staff/staff-payments/queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "staffPaymentsKeys",
    ()=>staffPaymentsKeys,
    "useStaffPaymentSummary",
    ()=>useStaffPaymentSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.5_react@19.2.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$payments$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-payments/fetchers.ts [app-ssr] (ecmascript)");
;
;
const staffPaymentsKeys = {
    all: [
        'staff-payments'
    ],
    summary: ()=>[
            ...staffPaymentsKeys.all,
            'summary'
        ]
};
const useStaffPaymentSummary = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: staffPaymentsKeys.summary(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$payments$2f$fetchers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffPaymentsFetchers"].getPaymentSummary,
        staleTime: 5 * 60 * 1000
    });
};
}),
"[project]/src/api/domains/staff/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Staff Dashboard
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$dashboard$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-dashboard/queries.ts [app-ssr] (ecmascript)");
// Staff Jobs
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$jobs$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-jobs/queries.ts [app-ssr] (ecmascript)");
// Staff Profile
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-profile/queries.ts [app-ssr] (ecmascript)");
// Staff Payments
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$payments$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-payments/queries.ts [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/src/app/staff/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StaffLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_@babel+core@7.28.5_babel-plugin-react-compiler@1.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_@babel+core@7.28.5_babel-plugin-react-compiler@1.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_@babel+core@7.28.5_babel-plugin-react-compiler@1.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-ssr] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-ssr] (ecmascript) <export default as IndianRupee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/monitor.js [app-ssr] (ecmascript) <export default as Monitor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/cn.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/api/domains/staff/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/domains/staff/staff-profile/queries.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/routes.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_@babel+core@7.28.5_babel-plugin-react-compiler@1.0.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ThemeContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
// Default avatar for staff without profile picture
const DEFAULT_AVATAR = '/images/avatars/default-avatar.svg';
const navigation = [
    {
        name: 'Dashboard',
        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].DASHBOARD,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: 'My Jobs',
        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].JOBS,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"]
    },
    {
        name: 'Payments',
        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].PAYMENTS,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__["IndianRupee"]
    },
    {
        name: 'History',
        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].HISTORY,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"]
    },
    {
        name: 'Profile',
        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$routes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StaffRoutes"].PROFILE,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    }
];
function StaffLayout({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const logoutMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStaffLogout"])();
    const { data: profile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$domains$2f$staff$2f$staff$2d$profile$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStaffProfile"])();
    const [avatarError, setAvatarError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showThemeMenu, setShowThemeMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { theme, resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    // Reset avatar error when profile changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setAvatarError(false);
    }, [
        profile?.avatar
    ]);
    const themeOptions = [
        {
            value: 'light',
            label: 'Light',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"]
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"]
        },
        {
            value: 'system',
            label: 'System',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"]
        }
    ];
    const handleLogout = ()=>{
        logoutMutation.mutate(undefined, {
            onSuccess: ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Logged out successfully');
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-10 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-custom",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-14 sm:h-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 sm:gap-3 min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
                                        children: profile?.avatar && !avatarError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: profile.avatar,
                                            alt: profile.name,
                                            className: "w-full h-full rounded-full object-cover",
                                            onError: ()=>setAvatarError(true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/staff/layout.tsx",
                                            lineNumber: 61,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: DEFAULT_AVATAR,
                                            alt: "Default avatar",
                                            className: "w-full h-full rounded-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/staff/layout.tsx",
                                            lineNumber: 68,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/staff/layout.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm sm:text-base md:text-lg font-bold text-foreground block truncate",
                                                children: profile?.name || 'Staff Portal'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/staff/layout.tsx",
                                                lineNumber: 76,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] sm:text-xs text-muted-foreground truncate",
                                                children: profile?.role || 'CarWash Services'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/staff/layout.tsx",
                                                lineNumber: 79,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/staff/layout.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/staff/layout.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowThemeMenu(!showThemeMenu),
                                                className: "p-2 rounded-lg hover:bg-muted transition-colors group cursor-pointer",
                                                "aria-label": "Toggle theme",
                                                children: resolvedTheme === 'dark' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                    className: "h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/staff/layout.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                    className: "h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/staff/layout.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/staff/layout.tsx",
                                                lineNumber: 87,
                                                columnNumber: 17
                                            }, this),
                                            showThemeMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "fixed inset-0 z-40",
                                                        onClick: ()=>setShowThemeMenu(false)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/staff/layout.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute right-0 mt-2 w-48 force-sheet-bg rounded-lg sm:rounded-xl shadow-lg border border-border py-2 z-50",
                                                        children: themeOptions.map((option)=>{
                                                            const Icon = option.icon;
                                                            const isActive = theme === option.value;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setTheme(option.value);
                                                                    setShowThemeMenu(false);
                                                                },
                                                                className: `w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/staff/layout.tsx",
                                                                        lineNumber: 117,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: option.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/staff/layout.tsx",
                                                                        lineNumber: 118,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, option.value, true, {
                                                                fileName: "[project]/src/app/staff/layout.tsx",
                                                                lineNumber: 107,
                                                                columnNumber: 27
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/staff/layout.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/staff/layout.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        className: "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex-shrink-0 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "h-4 w-4 sm:h-5 sm:w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/staff/layout.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline text-xs sm:text-sm font-medium",
                                                children: "Logout"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/staff/layout.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/staff/layout.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/staff/layout.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/staff/layout.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/staff/layout.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/staff/layout.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container-custom px-4 py-4 sm:py-6 pb-20 sm:pb-24",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/staff/layout.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-5 gap-0.5 sm:gap-1 max-w-screen-xl mx-auto",
                    children: navigation.map((item)=>{
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col items-center justify-center py-2 sm:py-3 text-[10px] sm:text-xs transition-all duration-200 relative', isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$cn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors', isActive ? 'bg-primary/10' : 'hover:bg-muted'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-4 w-4 sm:h-5 sm:w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/staff/layout.tsx",
                                        lineNumber: 166,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/staff/layout.tsx",
                                    lineNumber: 162,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-0.5 sm:mt-1 truncate max-w-full px-1",
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/staff/layout.tsx",
                                    lineNumber: 168,
                                    columnNumber: 17
                                }, this),
                                isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute top-0 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-0.5 sm:h-1 bg-primary rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/staff/layout.tsx",
                                    lineNumber: 170,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, item.name, true, {
                            fileName: "[project]/src/app/staff/layout.tsx",
                            lineNumber: 152,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/app/staff/layout.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/staff/layout.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/staff/layout.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_b0a89464._.js.map