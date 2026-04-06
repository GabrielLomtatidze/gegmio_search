"use client";
import ReviewCard from "@/components/cards/reviewCard"


export default function ReviewSection() {

    const reviews = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: "ირაკლი ბერიძე",
        date: "13 მარტი - 2025",
        review: "რესტორანი საკმაოდ დაფუძნდა 2013 წელს, ჩვენ გთავაზობთ საუკეთესო ხარისხის რესტორანულ მომსახურებას",
        rating: (Math.random() * 5).toFixed(1),
        avatar: "/images/test.svg",
    }));

    return (
        <div className="w-full mt-[30px] mb-[100px] flex flex-wrap gap-[12px] px-[12px] justify-cenmter items-center">
            {reviews.map((item) => (
                <ReviewCard
                    key={item.id}
                    name={item.name}
                    date={item.date}
                    review={item.review}
                    rating={Number(item.rating)}
                    avatar={item.avatar}
                />
            ))}

        </div>
    );
}