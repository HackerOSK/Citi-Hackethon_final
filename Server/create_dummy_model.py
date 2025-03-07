import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler

# Create a dummy dataset with the correct column names
data = {
    'Annual Revenue': np.random.randint(100000, 10000000, 100),
    'Loan Amount': np.random.randint(10000, 1000000, 100),
    'GST Compliance (%)': np.random.randint(0, 100, 100),
    'Past Defaults': np.random.randint(0, 5, 100),
    'Bank Transactions': np.random.choice(['Low', 'Medium', 'High'], 100),
    'Market Trend': np.random.randint(0, 3, 100),
    'Financial Health': np.random.random(100),
    'Repayment History': np.random.randint(0, 2, 100),
    'Credit Utilization': np.random.random(100),
    'Industry Risk': np.random.randint(0, 3, 100)
}

df = pd.DataFrame(data)

# Encode categorical variables
df['Bank Transactions'] = df['Bank Transactions'].map({'Low': 0, 'Medium': 1, 'High': 2})

# Create target variable (credit score)
y = 300 + 0.0001 * df['Annual Revenue'] + 0.0001 * df['Loan Amount'] + \
    df['GST Compliance (%)'] + (-50) * df['Past Defaults'] + \
    50 * df['Bank Transactions'] + 30 * df['Market Trend'] + \
    100 * df['Financial Health'] + 50 * df['Repayment History'] + \
    (-50) * df['Credit Utilization'] + (-30) * df['Industry Risk']

# Clip to reasonable credit score range
y = np.clip(y, 300, 900)

# Create and fit scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

# Train a simple model
model = GradientBoostingRegressor(n_estimators=50, random_state=42)
model.fit(X_scaled, y)

# Save model and scaler
joblib.dump(model, 'gradient_boosting_model.joblib')
joblib.dump(scaler, 'scaler.joblib')

print("Dummy model and scaler created successfully!")
print("Model expects these features:", df.columns.tolist()) 