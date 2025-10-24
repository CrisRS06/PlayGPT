# Probability Fundamentals for Sports Betting

## Introduction

Probability is the mathematical foundation of all gambling and betting. Understanding probability allows you to evaluate odds, calculate expected value, and make informed betting decisions. This module covers essential probability concepts every bettor must master.

## What is Probability?

Probability measures the likelihood of an event occurring, expressed as a number between 0 and 1 (or 0% to 100%).

- **Probability = 0** (0%): Event will never occur
- **Probability = 0.5** (50%): Event is equally likely to occur or not
- **Probability = 1** (100%): Event will definitely occur

### Basic Formula

**Probability = (Number of favorable outcomes) / (Total number of possible outcomes)**

**Example: Rolling a six-sided die**
- Probability of rolling a 4 = 1/6 ≈ 0.167 or 16.7%
- Probability of rolling an even number (2, 4, or 6) = 3/6 = 0.5 or 50%

## Types of Probability

### 1. Theoretical Probability
Based on mathematical principles and equal likelihood of outcomes.

**Example:** Fair coin flip
- P(Heads) = 0.5
- P(Tails) = 0.5

### 2. Empirical (Experimental) Probability
Based on observed data from past events.

**Example:** NFL team performance
- Team has won 8 out of last 12 games
- Empirical win probability = 8/12 = 0.667 or 66.7%

### 3. Subjective Probability
Based on judgment, expertise, and analysis.

**Example:** Handicapper's assessment
- After analyzing matchup, injuries, and trends, you estimate Team A has 60% chance to win

## Converting Between Odds and Probability

Understanding how to convert betting odds to probability is essential.

### American Odds to Probability

**For Negative Odds (favorites):**
Probability = (-Odds) / ((-Odds) + 100)

**Example: -150 odds**
P = 150 / (150 + 100) = 150 / 250 = 0.60 or 60%

**For Positive Odds (underdogs):**
Probability = 100 / (Odds + 100)

**Example: +200 odds**
P = 100 / (200 + 100) = 100 / 300 = 0.333 or 33.3%

### Implied Probability vs True Probability

**Implied Probability:** The probability suggested by betting odds (includes bookmaker's margin)

**True Probability:** Your assessment of the actual likelihood

**The Goal:** Find bets where True Probability > Implied Probability

**Example:**
- Odds: Patriots -110 → Implied Probability = 52.4%
- Your Analysis: Patriots have 56% chance → True Probability = 56%
- **Gap:** 56% - 52.4% = 3.6% edge (this is +EV!)

## Fundamental Rules of Probability

### Rule 1: Addition Rule (OR)
For mutually exclusive events, the probability of either occurring is the sum.

**P(A or B) = P(A) + P(B)**

**Example: Rolling a die**
- P(rolling 3 or 6) = P(3) + P(6) = 1/6 + 1/6 = 2/6 = 0.333

### Rule 2: Multiplication Rule (AND)
For independent events, the probability of both occurring is the product.

**P(A and B) = P(A) × P(B)**

**Example: Two coin flips**
- P(both heads) = P(heads) × P(heads) = 0.5 × 0.5 = 0.25 or 25%

### Rule 3: Complement Rule
The probability of an event NOT occurring is:

**P(not A) = 1 - P(A)**

**Example:**
- If Team A has 35% chance to win, they have 65% chance to NOT win

## Independent vs Dependent Events

### Independent Events
One event doesn't affect the probability of another.

**Examples:**
- Coin flips
- Different games in sports betting
- Roulette spins

**Example:** Past coin flips don't affect future flips
- Just because you got 5 heads in a row doesn't mean tails is "due"
- P(heads on next flip) = 50%, always

### Dependent Events
One event affects the probability of another.

**Examples:**
- Drawing cards without replacement
- Game outcomes in a playoff series (team momentum, injuries)

**Example: Drawing cards**
- P(drawing ace from full deck) = 4/52 ≈ 7.7%
- P(drawing another ace after first ace) = 3/51 ≈ 5.9%

## The Law of Large Numbers

As the number of trials increases, the observed probability approaches the theoretical probability.

### Short-Term Variance
In the short term, results can deviate significantly from expected probability.

**Example:**
- Fair coin flipped 10 times: Could get 7 heads (70%) instead of expected 5 (50%)
- This is normal variance, not evidence of a biased coin

### Long-Term Convergence
Over thousands of trials, results converge to true probability.

**Example:**
- Same coin flipped 10,000 times: Will get very close to 50% heads
- This is why casinos always win long-term (house edge + law of large numbers)

## Common Probability Mistakes

### Mistake 1: The Gambler's Fallacy
**False Belief:** Past results affect future independent events

**Example:**
- "Red has come up 5 times in roulette, so black is due!"
- **Truth:** Each spin is independent. P(red) = P(black) ≈ 47.4% every time

### Mistake 2: Ignoring the Base Rate
**False Belief:** Focusing on specific details while ignoring overall probability

**Example:**
- "This underdog has all these compelling storylines, so they'll win!"
- **Truth:** Underdogs lose most of the time, regardless of narrative

### Mistake 3: Overestimating Small Probabilities
**False Belief:** Rare events feel more likely than they are

**Example:**
- Parlays and lottery tickets feel like "good value"
- **Truth:** Multiplying small probabilities creates tiny win chances

### Mistake 4: Sample Size Neglect
**False Belief:** Drawing conclusions from too little data

**Example:**
- "This team is 3-0 in games after losing, so bet them after a loss!"
- **Truth:** 3 games is not statistically significant

## Calculating Parlay Probability

Parlays combine multiple bets. To win, ALL legs must win.

**Formula: P(Parlay) = P(Leg 1) × P(Leg 2) × P(Leg 3) × ...**

**Example: 3-leg parlay**
- Leg 1: 60% chance to win
- Leg 2: 55% chance to win
- Leg 3: 50% chance to win

P(All win) = 0.60 × 0.55 × 0.50 = 0.165 or 16.5%

**Why parlays are typically -EV:**
- Bookmakers pay less than true odds
- Multiplying probabilities creates small win chances
- Small edge per leg compounds into large disadvantage

## Probability in NFL Betting

### Point Spread Probability
Point spreads attempt to create 50/50 probability.

**Example: Patriots -7 vs Jets +7**
- In theory: 50% chance Patriots cover, 50% Jets cover
- In reality: Vig makes it 52.4% needed to break even
- Your goal: Find spreads where true probability ≠ 50%

### Over/Under Probability
Total points bet also targets 50/50 split.

**Example: Total 45.5 points**
- Bookmaker estimates equal chance of Over or Under
- Your edge: Better model for predicting total points

### Moneyline Probability
Odds reflect win probability (with vig built in).

**Example:**
- Favorite: -200 (66.7% implied probability)
- Underdog: +170 (37% implied probability)
- **Notice:** 66.7% + 37% = 103.7% (the extra 3.7% is the vig)

## Conditional Probability

The probability of an event given that another event has occurred.

**Formula: P(A|B) = P(A and B) / P(B)**

**Sports Betting Example:**
- P(Team wins | Their star QB plays) = 70%
- P(Team wins | Their star QB is injured) = 35%
- Conditional probability changes based on context

## Practice Problems

1. A team is -250 favorites. What's the implied probability they win?

2. You estimate two independent bets each have 60% chance to win. What's the probability both win?

3. A coin has landed heads 10 times in a row. What's the probability of heads on the next flip?

4. If the implied probability of a bet is 52.4% and your true probability is 55%, should you bet it?

## Key Takeaways

1. **Probability quantifies uncertainty** - Essential for evaluating all bets

2. **Convert odds to probability** - Know what the market thinks vs what you think

3. **Independent events don't have memory** - Past results don't affect future independent outcomes

4. **Law of large numbers** - Short-term variance is normal; long-term probability prevails

5. **Parlays multiply probabilities** - Small win chances, typically -EV

6. **Find probability edges** - Profit comes from better probability estimates than the market

7. **Sample size matters** - Don't draw conclusions from small datasets

## Further Reading

- "Thinking, Fast and Slow" by Daniel Kahneman (cognitive biases in probability judgments)
- "The Signal and the Noise" by Nate Silver (probability in prediction)
- "Fortune's Formula" by William Poundstone (Kelly Criterion and probability)

## Glossary

- **Probability:** Likelihood of an event, expressed 0-1 or 0%-100%
- **Implied Probability:** Probability suggested by betting odds
- **True Probability:** Actual likelihood based on analysis
- **Independent Events:** Events that don't affect each other
- **Dependent Events:** Events that influence each other
- **Law of Large Numbers:** Results converge to expected probability over many trials
- **Sample Size:** Number of trials or observations
- **Gambler's Fallacy:** False belief that past random events affect future ones
