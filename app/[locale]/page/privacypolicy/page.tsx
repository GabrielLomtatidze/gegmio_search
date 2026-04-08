import { useTranslations } from "next-intl";


export default function PrivacyPolicy() {
    
    const t = useTranslations();
    
    return (
        <>
            <div>
                <div className="w-full bg-[#0F0F0F] flex justify-center m-auto py-[70px]">
                    <div className="max-w-7xl w-full m-auto p-4 md:px-[100px]">

                        <div>
                            <h1 className="text-[32px] text-white font-bold">Gegmio Privacy Policy </h1>
                            <p className="text-white mt-2.5">Gegmio LLC (“Gegmio”, “we”, “our”, or “us”) operates the Gegmio mobile application, the Gegmio website (gegmio.com), and related services including business management tools (collectively referred to as the “Service”).)<br />
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. It is governed by the Personal Data Protection Law of Georgia<br />Email: info@gegmio.com<br />By accessing or using the Service, you agree to the practices described in this Privacy Policy.</p>
                        </div>

                        <div className="mt-[30px]">
                            <h1 className="text-[32px] text-white font-bold">1. Information We Collect</h1>
                            <h3 className="text-[24px] text-white">1.1 Account Registration Information</h3>
                            <p className="text-white mt-2.5">
                                When you create an account, we may collect:
                            </p>
                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Name or username</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Profile photo (optional)</li>
                                <li>Account login credentials (securely encrypted)</li>
                            </ul>
                            <p className="text-white mt-[5px]">
                                This information is used to create and manage your account and provide access to platform features. Login is required to use the Service.
                            </p>

                            <h3 className="text-[24px] text-white mt-[20px]">1.2 Account Registration Information</h3>
                            <p className="text-white mt-2.5">
                                Businesses registered on Gegmio may provide:
                            </p>
                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Business name and category</li>
                                <li>Address and location</li>
                                <li>Phone number (displayed for click-to-call functionality)</li>
                                <li>Social media links</li>
                                <li>Photos of the business</li>
                                <li>Menus, service listings, prices, and descriptions</li>
                            </ul>
                            <p className="text-white mt-[5px]">
                                This information is publicly visible within the platform to allow users to discover and contact businesses. Businesses are responsible for ensuring the accuracy of the information they provide.
                            </p>

                            <h3 className="text-[24px] text-white mt-[20px]">1.3 Location Information</h3>
                            <p className="text-white mt-2.5">
                                With your permission, Gegmio may access your device location to show nearby businesses,
                                calculate distances, and improve search and discovery results. You may disable location
                                access at any time through your device settings.
                            </p>
                            <p className="text-white mt-[5px]">
                                Precise location history is not stored on our servers.
                            </p>

                            <h3 className="text-[24px] text-white mt-[20px]">1.4 Device and Technical Information</h3>
                            <p className="text-white mt-2.5">
                                When you use the Service, we may automatically collect:
                            </p>
                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Device type and operating system version</li>
                                <li>Application version</li>
                                <li>Crash reports and error logs</li>
                                <li>Basic usage data (e.g. screens visited, session duration)</li>
                            </ul>
                            <p className="text-white mt-[5px]">
                                This data is used to maintain platform stability and improve the user experience.
                                It is not linked to your personal identity.
                            </p>

                            <h3 className="text-[24px] text-white mt-[20px]">1.5 Camera, QR Code, and Photo Access</h3>
                            <p className="text-white mt-2.5">
                                The app may request access to your device camera or photo library for the following purposes:
                            </p>
                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Uploading a profile photo</li>
                                <li>Uploading business photos or menu images</li>
                                <li>Scanning QR codes generated by businesses on the platform</li>
                            </ul>
                            <p className="text-white mt-[5px]">
                                QR code scanning is used to verify that a user has physically visited a business
                                location. This verification is required before a review can be submitted.
                            </p>
                            <p className="text-white mt-[5px]">
                                The QR scan event is logged for the purpose of enabling the review and contributing
                                to the business’s aggregated analytics. No precise scan location or personal
                                movement data is stored.
                            </p>
                            <p className="text-white mt-[5px]">
                                You can revoke camera and photo permissions at any time through your device settings.
                            </p>

                            <h3 className="text-[24px] text-white mt-[20px]">1.6 Reviews and Ratings</h3>
                            <p className="text-white mt-2.5">
                                Users may submit reviews and ratings about businesses after verifying their visit
                                via QR code scan. Reviews may include:
                            </p>
                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Username</li>
                                <li>Star rating</li>
                                <li>Written feedback</li>
                            </ul>
                            <p className="text-white mt-[5px]">
                                Reviews are publicly visible on the business profile within the platform.
                                Users are responsible for the content they publish.
                            </p>
                            <p className="text-white mt-[5px]">
                                Gegmio reserves the right to moderate or remove content that violates community
                                standards, including abusive language, spam, false information, or inappropriate content.
                            </p>
                        </div>

                        <div className="mt-[30px]">
                            <h1 className="text-[32px] text-white font-bold">2. How We Use Your Information</h1>
                            <p className="text-white mt-2.5">We use collected information to:</p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Provide and operate the Gegmio platform</li>
                                <li>Enable discovery of local businesses</li>
                                <li>Manage user and business accounts</li>
                                <li>Display business contact details including phone numbers for direct calling</li>
                                <li>Verify physical visits via QR code to enable review submission</li>
                                <li>Generate aggregated, anonymised analytics for businesses (e.g. total profile views, review counts, overall rating)</li>
                                <li>Improve service performance and security</li>
                                <li>Respond to support requests</li>
                                <li>Send service-related notifications and updates</li>
                                <li>Personalise search results based on location</li>
                            </ul>

                            <p className="text-white mt-[5px]">
                                We do not use your data for advertising, third-party profiling, or automated decision-making.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">3. Business Analytics</h1>
                            <p className="text-white mt-2.5">
                                Businesses using Gegmio have access to the following aggregated analytics within the app and CRM dashboard:
                            </p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Total number of profile views</li>
                                <li>Total number of QR code scans</li>
                                <li>Number of reviews received (positive and negative breakdown)</li>
                                <li>Overall rating score</li>
                            </ul>

                            <p className="text-white mt-[5px]">
                                This analytics data is aggregated and does not identify individual users. Businesses cannot see the personal
                                details of users who viewed their profile or scanned their QR code.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">4. Click-to-Call Functionality</h1>
                            <p className="text-white mt-2.5">
                                Gegmio allows users to initiate phone calls directly to businesses by tapping a displayed phone number.
                                This action opens your device’s native phone dialer with the business number pre-filled.
                            </p>

                            <p className="text-white mt-[5px]">
                                Gegmio does not intercept, record, log, or store any information about calls made through this feature.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">5. Push Notifications</h1>
                            <p className="text-white mt-2.5">
                                With your consent, Gegmio may send push notifications related to platform updates, nearby places or
                                recommendations, and service alerts.
                            </p>

                            <p className="text-white mt-[5px]">
                                You may disable push notifications at any time through your device settings.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">6. Sharing of Information</h1>
                            <p className="text-white mt-2.5">
                                We do not sell, rent, or trade your personal data to third parties.
                            </p>

                            <p className="text-white mt-[5px]">
                                Information may be shared only in the following limited circumstances:
                            </p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>With service providers necessary to operate the Service (e.g. hosting infrastructure providers)</li>
                                <li>With mapping services such as Google Maps for location and distance functionality</li>
                                <li>When required by Georgian law or a lawful legal process</li>
                                <li>To protect the rights, safety, or security of Gegmio and its users</li>
                            </ul>

                            <p className="text-white mt-[5px]">
                                Public business information (business name, location, contact details, menus, and service listings)
                                is visible to all users of the platform by design.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">7. Third-Party Services</h1>
                            <p className="text-white mt-2.5">
                                The Service relies on the following third-party technologies:
                            </p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Google Maps — for location, distance, and map functionality</li>
                                <li>Application infrastructure providers — used to host and operate the platform</li>
                            </ul>

                            <p className="text-white mt-[5px]">
                                These services may process limited technical data as required for their functionality and operate
                                under their own privacy policies.
                            </p>
                        </div>

                        <div className="mt-[30px]">
                            <h1 className="text-[32px] text-white font-bold">8. Your Rights Under Georgian Data Protection Law</h1>
                            <p className="text-white mt-2.5">
                                In accordance with the Personal Data Protection Law of Georgia, you have the right to:
                            </p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction of inaccurate or incomplete data</li>
                                <li>Request deletion of your personal data</li>
                                <li>Withdraw consent for data processing at any time</li>
                                <li>Lodge a complaint with the Personal Data Protection Service of Georgia</li>
                            </ul>

                            <p className="text-white mt-[5px]">
                                To exercise any of these rights, contact us at info@gegmio.com. We will respond within
                                10 business days.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">9. Data Security</h1>
                            <p className="text-white mt-2.5">
                                We implement reasonable technical and organisational measures to protect your
                                information, including:
                            </p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Secure HTTPS data transmission</li>
                                <li>Encrypted password storage</li>
                                <li>Restricted internal system access</li>
                            </ul>

                            <p className="text-white mt-[5px]">
                                However, no electronic system can guarantee absolute security. We encourage users to
                                use strong, unique passwords and to notify us immediately of any suspected
                                unauthorised access to their account.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">10. Account Deletion</h1>
                            <p className="text-white mt-2.5">
                                Users may delete their account directly within the app. Upon deletion:
                            </p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>Personal profile information is permanently removed</li>
                                <li>Access to the account is permanently disabled</li>
                                <li>Associated reviews may be removed from the platform</li>
                            </ul>

                            <p className="text-white mt-[5px]">
                                Business owners may remove their business profile through the platform or by
                                contacting support at info@gegmio.com.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">11. Data Retention</h1>
                            <p className="text-white mt-2.5">
                                We retain your information only for as long as necessary to provide the Service and
                                comply with legal obligations. Typical retention periods are:
                            </p>

                            <ul className="text-white list-disc list-inside mt-[5px]">
                                <li>User accounts — retained until deleted by the user</li>
                                <li>Business profiles — retained until removed by the business owner</li>
                                <li>Reviews — retained until the associated user account is deleted</li>
                                <li>Technical logs — up to 12 months</li>
                            </ul>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">12. Children’s Privacy</h1>
                            <p className="text-white mt-2.5">
                                The Service is intended for users 18 years of age and older. We do not knowingly
                                collect personal information from individuals under 18. If we become aware that such
                                information has been collected, we will take prompt steps to delete it.
                            </p>

                            <h1 className="text-[32px] text-white font-bold mt-[30px]">13. Changes to This Privacy Policy</h1>
                            <p className="text-white mt-2.5">
                                We may update this Privacy Policy periodically. When changes occur, the revised
                                version will be published on our website with a new “Last Updated” date.
                            </p>

                            <p className="text-white mt-[5px]">
                                Continued use of the Service after updates constitutes acceptance of the revised
                                policy.
                            </p>
                        </div>

                        <div className="mt-[30px]">
                            <h1 className="text-[32px] text-white font-bold">14. Contact Information</h1>

                            <p className="text-white mt-2.5">
                                If you have questions about this Privacy Policy or your personal data, please contact:
                            </p>

                            <p className="text-white mt-[10px]">
                                Gegmio LLC
                            </p>
                            <p className="text-white">
                                Email: info@gegmio.com
                            </p>
                            <p className="text-white">
                                Website: https://gegmio.com
                            </p>
                            <p className="text-white">
                                Location: Georgia
                            </p>

                            <p className="text-white mt-[10px]">
                                You also have the right to contact the Personal Data Protection Service of Georgia
                                if you believe your data rights have been violated.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>

    );
};
