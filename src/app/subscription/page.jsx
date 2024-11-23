"use client"

import { useRouter } from "next/navigation";

const SubscriptionPage = () => {
    const router = useRouter();

    const plans = [
        {
            name: "BASIC",
            price: 50,
            period: "Three Month",
            features: [
                "Solve Questions By Zini Ai",
                "All Features",
                "Chat Support",
                "50 Reputations",
                "Quary Pro Badges",
                "Email Updates",
            ],
        },
        {
            name: "STANDARD",
            price: 80,
            period: "One Year",
            features: [
                "Solve Questions By Zini Ai",
                "All Features",
                "Chat Support",
                "100 Reputations",
                "Quary Pro Badges",
                "Email Updates",
            ],
        },
        {
            name: "PREMIUM",
            price: 120,
            period: "Life Time",
            features: [
                "Solve Questions By Zini Ai",
                "All Features",
                "Chat Support",
                "200 Reputations",
                "Quary Pro Badges",
                "Email Updates",
            ],
        },
    ];

    const handlePlanSelection = (plan) => {
        router.push(`/subscription/${plan.name.toLowerCase()}/payments`);
    };

    return (
        <div className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pick Best The Plan</h2>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
                    Take your desired plan to get access to our content easily, we
                    like to offer special license offers to our users.
                </p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">{plan.name}</h3>
                        <div className="text-4xl font-bold text-blue-600 mb-2">${plan.price}</div>
                        <div className="text-gray-500 mb-4">{plan.period}</div>
                        <ul className="mb-6">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center justify-center text-gray-700 mb-2">
                                    <svg
                                        className="w-5 h-5 text-green-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handlePlanSelection(plan)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;