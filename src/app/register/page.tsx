import RoleCard from "@/components/Register/RoleCard";

export default function RegisterLanding() {
  return (
    <main className="bg-app-background">

      <section className="mx-auto max-w-6xl px-7 pt-8">
        <h1 className="text-4xl font-extrabold text-app-bronze">
          Hungry? Selling? Driving? We Got You!
        </h1>
        <p className="mt-2 text-app-bronze/80">
          Select the role you desire and become part of our community.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <RoleCard
            role="restaurant"
            titleRole="Restaurant"
            subtitle="Grow With Us"
            iconSrc="/images/meowth-cooking.webp"
            href="/register/restaurant"
            badgeColor="text-restaurant-font"
            features={[
              { text: '<b>More Orders, More Customers</b><br/>Tap into a huge food-loving community.' },
              { text: '<b>Free Promotion</b><br/>Get featured in-app and boost visibility.' },
              { text: '<b>Smart Insights</b><br/>Track sales & performance.' },
              { text: '<b>Secure Payments</b><br/>Fast, reliable payouts.' },
              { text: '<b>Flexible Partnership</b><br/>Set your menu & pricing.' },
            ]}
          />

          <RoleCard
            role="customer"
            titleRole="Customer"
            subtitle="Eat Without Limits!"
            iconSrc="/images/meowth-eating.webp"
            href="/register/customer"
            badgeColor="text-customer-font"
            features={[
              { text: '<b>Fast Delivery</b><br/>Hot & fresh meals.' },
              { text: '<b>Nationwide Choices</b><br/>Order from anywhere.' },
              { text: '<b>Endless Variety</b><br/>Street food to gourmet.' },
              { text: '<b>Exclusive Deals</b><br/>Discounts & loyalty points.' },
              { text: '<b>Easy Tracking</b><br/>Real-time order updates.' },
            ]}
          />

          <RoleCard
            role="driver"
            titleRole="Driver"
            subtitle="Deliver & Earn"
            iconSrc="/images/meowth-driving.webp"
            href="/register/driver"
            badgeColor="text-driver-font"
            features={[
              { text: '<b>Earn More, Anytime</b><br/>Flexible hours.' },
              { text: '<b>Smart Navigation</b><br/>Optimized routes.' },
              { text: '<b>Incentives & Bonuses</b><br/>Extra rewards.' },
              { text: '<b>Steady Demand</b><br/>Thousands of orders daily.' },
              { text: '<b>Safety First</b><br/>Contactless & in-app support.' },
            ]}
          />
        </div>
      </section>
    </main>
  );
}