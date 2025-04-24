import dash
from dash import dcc, html
import plotly.graph_objs as go
import pandas as pd
import plotly.io as pio

# Sample data
data = [
    {"HQ Name": "Hooghly", "Sales Achievement %": 109.53, "Total Sales": 743021.11, "Total Target": 678350},
    {"HQ Name": "Kolkata", "Sales Achievement %": 102.43, "Total Sales": 10106047.64, "Total Target": 9865927},
    {"HQ Name": "Ranaghat", "Sales Achievement %": 100.09, "Total Sales": 528922.2, "Total Target": 528462},
    {"HQ Name": "Siliguri", "Sales Achievement %": 103.87, "Total Sales": 1220684.83, "Total Target": 1175215},
]
df = pd.DataFrame(data)

# Average Sales Achievement
average_achievement = round(df["Sales Achievement %"].mean(), 2)

# Sales Achievement Gauge
gauge_figure = go.Figure(go.Indicator(
    mode="gauge+number",
    value=average_achievement,
    title={'text': "Sales Achievement"},
    gauge={'axis': {'range': [None, 120]}, 'bar': {'color': "orange"}}
))
pio.write_image(gauge_figure, "sales_achievement_gauge.png")

# Total Sales Bar Chart
total_sales_figure = go.Figure(data=[
    go.Bar(x=df["HQ Name"], y=df["Total Sales"], name='Total Sales', marker_color='royalblue')
]).update_layout(title="Total Sales by HQ", xaxis_title="HQ", yaxis_title="Sales")
pio.write_image(total_sales_figure, "total_sales_bar_chart.png")

# Sales Achievement % Horizontal Bar Chart
achievement_figure = go.Figure(data=[
    go.Bar(y=df["HQ Name"], x=df["Sales Achievement %"], orientation='h', marker_color='orange')
]).update_layout(title="Sales Achievement % by HQ", xaxis_title="Achievement %", yaxis_title="HQ")
pio.write_image(achievement_figure, "sales_achievement_horizontal_bar_chart.png")

# Total Sales vs Total Target Grouped Bar Chart
grouped_bar_figure = go.Figure(data=[
    go.Bar(name='Sales', x=df["HQ Name"], y=df["Total Sales"], marker_color='blue'),
    go.Bar(name='Target', x=df["HQ Name"], y=df["Total Target"], marker_color='orange')
]).update_layout(
    barmode='group',
    title="Total Sales vs. Total Target by HQ",
    xaxis_title="HQ",
    yaxis_title="Amount"
)
pio.write_image(grouped_bar_figure, "total_sales_vs_target_grouped_bar_chart.png")

# Initialize the Dash app
app = dash.Dash(__name__)
app.title = "KPI Dashboard"

app.layout = html.Div([
    html.H1("KPI DASHBOARD", style={'textAlign': 'center'}),

    dcc.Graph(figure=gauge_figure),
    dcc.Graph(figure=total_sales_figure),
    dcc.Graph(figure=achievement_figure),
    dcc.Graph(figure=grouped_bar_figure)
])

if __name__ == '__main__':
    app.run(debug=True)
