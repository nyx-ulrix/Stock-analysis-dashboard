#!/usr/bin/env python3
"""
=============================================================================
STOCK ANALYSIS DASHBOARD - TEST DATA GENERATOR
=============================================================================
This script generates realistic test data for the stock analysis dashboard.
It creates various types of market conditions to test different scenarios:
- Normal market conditions
- Bull market (upward trend)
- Bear market (downward trend)
- High volatility periods
- Small datasets for quick testing

The generated data follows realistic stock price patterns using mathematical
models like geometric Brownian motion.
=============================================================================
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random


def _set_random_seed():
    """Set random seed for reproducible results across all random number generators."""
    np.random.seed(42)
    random.seed(42)


def generate_stock_data(days=252, start_price=100.0, volatility=0.02):
    """
    Generate realistic stock price data using geometric Brownian motion.

    This function creates stock price data that follows realistic patterns
    found in financial markets. It uses mathematical models to simulate
    price movements, volume, and OHLC (Open, High, Low, Close) data.

    Args:
        days (int): Number of trading days to generate (default: 252)
        start_price (float): Starting price of the stock (default: 100.0)
        volatility (float): Daily volatility as standard deviation of returns (default: 0.02)

    Returns:
        pandas.DataFrame: Stock data with columns: date, open, high, low, close, volume
    """
    # Set random seed for reproducible results
    _set_random_seed()

    # Generate trading days (weekdays only, excluding weekends)
    start_date = datetime(2023, 1, 1)
    dates = []
    current_date = start_date

    while len(dates) < days:
        if current_date.weekday() < 5:  # Monday = 0, Sunday = 6
            dates.append(current_date)
        current_date += timedelta(days=1)

    # Generate price movements using geometric Brownian motion
    # This creates realistic random walk behavior for stock prices
    returns = np.random.normal(0, volatility, days)
    prices = [start_price]

    for i in range(1, days):
        # Calculate new price based on previous price and random return
        price = prices[-1] * (1 + returns[i])
        prices.append(max(price, 0.01))  # Ensure price doesn't go negative

    # Generate OHLC (Open, High, Low, Close) data for each day
    data = []
    for i, (date, close_price) in enumerate(zip(dates, prices)):
        # Generate realistic daily volatility
        daily_vol = abs(np.random.normal(0, volatility * 0.5))

        # Open price (usually close to previous close with some gap)
        if i == 0:
            open_price = close_price
        else:
            gap = np.random.normal(0, daily_vol * 0.3)
            open_price = max(close_price + gap, 0.01)

        # High and low prices (intraday movement)
        high_price = max(open_price, close_price) * \
            (1 + abs(np.random.normal(0, daily_vol)))
        low_price = min(open_price, close_price) * \
            (1 - abs(np.random.normal(0, daily_vol)))

        # Ensure OHLC relationships are valid
        high_price = max(high_price, open_price, close_price)
        low_price = min(low_price, open_price, close_price)

        # Generate trading volume (higher volume on bigger price moves)
        base_volume = 1000000
        volume_multiplier = 1 + abs(returns[i]) * 5
        volume = int(base_volume * volume_multiplier *
                     np.random.uniform(0.5, 1.5))

        # Store the day's data
        data.append({
            'date': date.strftime('%Y-%m-%d'),
            'open': round(open_price, 2),
            'high': round(high_price, 2),
            'low': round(low_price, 2),
            'close': round(close_price, 2),
            'volume': volume
        })

    return pd.DataFrame(data)


def generate_trending_data(days=252, start_price=100.0, trend=0.001):
    """
    Generate stock data with a clear trend (bull or bear market).

    This function creates data that shows a consistent upward or downward
    trend over time, simulating bull markets (positive trend) or bear
    markets (negative trend).

    Args:
        days (int): Number of trading days to generate (default: 252)
        start_price (float): Starting price of the stock (default: 100.0)
        trend (float): Daily trend factor (positive for bull market, negative for bear market)

    Returns:
        pandas.DataFrame: Stock data with clear trend pattern
    """
    # Set random seed for reproducible results
    _set_random_seed()

    # Generate trading days (weekdays only)
    start_date = datetime(2023, 1, 1)
    dates = []
    current_date = start_date

    while len(dates) < days:
        if current_date.weekday() < 5:  # Monday = 0, Sunday = 6
            dates.append(current_date)
        current_date += timedelta(days=1)

    # Generate prices with consistent trend
    prices = [start_price]
    for i in range(1, days):
        # Add trend component plus some random noise
        change = trend + np.random.normal(0, 0.02)
        new_price = prices[-1] * (1 + change)
        prices.append(max(new_price, 0.01))  # Ensure price doesn't go negative

    # Generate OHLC data for each day
    data = []
    for i, (date, close_price) in enumerate(zip(dates, prices)):
        # Use lower volatility for trending data
        daily_vol = 0.01

        # Open price calculation
        if i == 0:
            open_price = close_price
        else:
            gap = np.random.normal(0, daily_vol * 0.3)
            open_price = max(close_price + gap, 0.01)

        # High and low prices
        high_price = max(open_price, close_price) * \
            (1 + abs(np.random.normal(0, daily_vol)))
        low_price = min(open_price, close_price) * \
            (1 - abs(np.random.normal(0, daily_vol)))

        # Ensure OHLC relationships are valid
        high_price = max(high_price, open_price, close_price)
        low_price = min(low_price, open_price, close_price)

        # Generate volume
        volume = int(1000000 * (1 + abs(np.random.normal(0, 0.3))))

        # Store the day's data
        data.append({
            'date': date.strftime('%Y-%m-%d'),
            'open': round(open_price, 2),
            'high': round(high_price, 2),
            'low': round(low_price, 2),
            'close': round(close_price, 2),
            'volume': volume
        })

    return pd.DataFrame(data)


# =============================================================================
# MAIN EXECUTION
# =============================================================================
# This section runs when the script is executed directly (not imported)

if __name__ == "__main__":
    print("Generating test data for stock analysis dashboard...")
    print("=" * 60)

    # Generate different types of test data for various scenarios
    print("1. Generating normal market data (252 days)...")
    print("   - Standard market conditions with moderate volatility")
    normal_data = generate_stock_data(
        days=252, start_price=100.0, volatility=0.02)
    normal_data.to_csv('test_data_normal.csv', index=False)
    print(f"   ✅ Saved: test_data_normal.csv ({len(normal_data)} days)")

    print("\n2. Generating bull market data (252 days)...")
    print("   - Upward trending market with positive daily returns")
    bull_data = generate_trending_data(
        days=252, start_price=100.0, trend=0.001)
    bull_data.to_csv('test_data_bull.csv', index=False)
    print(f"   ✅ Saved: test_data_bull.csv ({len(bull_data)} days)")

    print("\n3. Generating bear market data (252 days)...")
    print("   - Downward trending market with negative daily returns")
    bear_data = generate_trending_data(
        days=252, start_price=100.0, trend=-0.0008)
    bear_data.to_csv('test_data_bear.csv', index=False)
    print(f"   ✅ Saved: test_data_bear.csv ({len(bear_data)} days)")

    print("\n4. Generating high volatility data (100 days)...")
    print("   - High volatility scenario with large price swings")
    volatile_data = generate_stock_data(
        days=100, start_price=100.0, volatility=0.05)
    volatile_data.to_csv('test_data_volatile.csv', index=False)
    print(f"   ✅ Saved: test_data_volatile.csv ({len(volatile_data)} days)")

    print("\n5. Generating small dataset for quick testing (20 days)...")
    print("   - Small dataset for rapid testing and validation")
    small_data = generate_stock_data(
        days=20, start_price=100.0, volatility=0.02)
    small_data.to_csv('test_data_small.csv', index=False)
    print(f"   ✅ Saved: test_data_small.csv ({len(small_data)} days)")

    print("\n" + "=" * 60)
    print("🎉 Test data generation complete!")
    print("\nYou can now use any of these CSV files to test the stock analysis dashboard.")
    print("\n📋 Recommended testing order:")
    print("   1. test_data_small.csv    - Quick validation and testing")
    print("   2. test_data_normal.csv   - Standard market conditions")
    print("   3. test_data_bull.csv     - Bull market trends")
    print("   4. test_data_bear.csv     - Bear market trends")
    print("   5. test_data_volatile.csv - High volatility scenarios")
    print("\n💡 Tip: Start with the small dataset for quick feedback!")
