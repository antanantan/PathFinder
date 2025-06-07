FROM python:3.12
WORKDIR /app

# Install the application dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy in the source code
COPY app ./app
EXPOSE 8000

# Setup an app user so the container doesn't run as the root user
RUN useradd app
USER app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 
#Remove --reload for prod