FROM python:3.8
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction
EXPOSE 5000
CMD gunicorn -b 0.0.0.0:$PORT backend.app:app
