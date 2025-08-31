import React from "react";

const Nutrition = () => {
  return (
    <div className="nutrition-container">
      <h1>Practical Meal Plan for Health and Weight Loss</h1>

      <p>
        Nutrition is the most important aspect of health—and also the easiest
        and hardest to get right. Many people believe eating healthy requires a
        big budget or hours in the kitchen. In reality, the healthiest diet is
        often simple, affordable, and time-efficient.
      </p>

      <h2>Common Eating Mistakes to Avoid</h2>
      <ul>
        <li>
          <strong>Constant snacking:</strong> Eating all day prevents your
          stomach (a muscle) from resting and repairing. Finish your last meal
          at least 3 hours before bed—ideally something light like a fruit
          smoothie with plant-based protein. Snacking is often an unconscious,
          addictive behavior. Pay attention to whether you’re truly hungry
          before reaching for food outside of planned meals.
        </li>
        <li>
          <strong>Too many meals:</strong> Stick to 2–3 meals a day with no
          snacks or cheat meals. Processed foods like bread, pasta, pizza, and
          pastries are essentially sugar and fat engineered to be addictive.
          Once your body adapts, you’ll notice more stable energy—even with
          fewer meals.
        </li>
        <li>
          <strong>Cheat meals:</strong> “Cheat” meals often turn into cheat
          days, weeks, or months. For long-term health, commit fully to your
          nutrition plan instead of relying on food for comfort, social
          pressure, or stress.
        </li>
        <li>
          <strong>Skipping supplements:</strong> It’s nearly impossible to meet
          all micronutrient needs from food alone. To optimize health, consider
          adding these supplements:
          <ul className="top-spacer-nutrition">
            <li>Vitamin D3</li>
            <li>Glucosamine + Chondroitin</li>
            <li>Vitamin B12</li>
            <li>Omega-3 (DHA + EPA)</li>
          </ul>
        </li>
      </ul>

      <h2>Sample Meals</h2>
      <ol>
        <li>
          <strong className="ol-title">
            Morning Antioxidant Bowl (Light Breakfast)
          </strong>
          <ul>
            <li>
              1 cup mixed berries (blueberries, raspberries, blackberries,
              cherries)
            </li>
            <li>1 tbsp each: hemp seeds, chia seeds, flax seeds</li>
            <li>½ cup oats</li>
            <li>10 almonds or walnuts</li>
            <li>Add your favorite plant based milk</li>
          </ul>
        </li>

        <li>
          <strong className="ol-title">
            Manly Veggies (Hearty Veggie Dish)
          </strong>
          <ul>
            <li>45 g dry black lentils (~150 g cooked)</li>
            <li>250 g broccoli (head + stalk, or sprouts)</li>
            <li>150 g cauliflower</li>
            <li>50 g shiitake or maitake mushrooms</li>
            <li>1 clove garlic</li>
            <li>3 g ginger root</li>
            <li>1 lime</li>
            <li>1 tbsp cumin</li>
            <li>1 tbsp apple cider vinegar</li>
            <li>1 tbsp hemp seeds</li>
            <li>1 tbsp extra virgin olive oil (drizzle after cooking)</li>
          </ul>
        </li>

        <li>
          <strong className="ol-title">Body Cell Refresher (Big Salad)</strong>
          <ul>
            <li>Kale</li>
            <li>Lemon juice</li>
            <li>White balsamic vinegar</li>
            <li>Avocado</li>
            <li>Cabbage</li>
            <li>Apples</li>
            <li>Dried cherries</li>
            <li>Red onions</li>
            <li>Chives</li>
            <li>Raw tofu (optional, for extra protein)</li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default Nutrition;
