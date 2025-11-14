document.addEventListener('DOMContentLoaded', function() {
  const predictForm = document.getElementById('predictForm');
  const tickerSelect = document.getElementById('tickerSelect');
  const tickerInput = document.getElementById('ticker');
  const daysSlider = document.getElementById('days');
  const daysValue = document.getElementById('daysValue');
  const predictBtn = document.getElementById('predictBtn');
  const loading = document.getElementById('loading');
  const result = document.getElementById('result');

  daysSlider.addEventListener('input', function() {
    daysValue.textContent = this.value + ' days';
  });

  tickerSelect.addEventListener('change', function() {
    if (this.value) {
      tickerInput.value = this.value;
    }
  });

  predictForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const ticker = tickerInput.value.trim().toUpperCase();
    const days = parseInt(daysSlider.value);
    
    loading.classList.remove('hidden');
    predictBtn.disabled = true;
    
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, days })
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      // Clear previous results
      result.innerHTML = `
        <div id="predictionChart" class="chart-container"></div>
        <div id="predictionDetails" class="details-container"></div>
        <div id="recommendation" class="recommendation"></div>
      `;
      
      // Create chart
      const ctx = document.createElement('canvas');
      document.getElementById('predictionChart').appendChild(ctx);
      
      // Create fake historical and prediction data for demonstration
      const historical = [150, 151, 152, 153, 154];
      const predictions = [155, 156, 157, 158, 159];
      const labels = Array.from({length: historical.length + predictions.length}, (_, i) => i);
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Historical Price',
              data: historical,
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              fill: false
            },
            {
              label: 'Predicted Price',
              data: [...Array(historical.length).fill(null), ...predictions],
              borderColor: '#28a745',
              borderDash: [5, 5],
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Days'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price ($)'
              }
            }
          }
        }
      });

      // Show details
      document.getElementById('predictionDetails').innerHTML = `
        <h3>${ticker} - Prediction Details</h3>
        <p><strong>Current Price:</strong> $${data.current_price}</p>
        <p><strong>Predicted Price:</strong> $${data.predicted_price}</p>
        <p><strong>Price Change:</strong> $${(data.predicted_price - data.current_price).toFixed(2)} 
           (${(((data.predicted_price - data.current_price) / data.current_price) * 100).toFixed(2)}%)</p>
      `;

      // Show recommendation
      const recDiv = document.getElementById('recommendation');
      recDiv.className = `recommendation ${data.recommendation.toLowerCase()}`;
      recDiv.innerHTML = `<i class="fas fa-lightbulb"></i> Recommendation: ${data.recommendation}`;
      
    } catch (error) {
      result.innerHTML = `<div style="color:red;padding:20px;">Error: ${error.message}</div>`;
    } finally {
      loading.classList.add('hidden');
      predictBtn.disabled = false;
    }
  });
});