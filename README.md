# Feminine Shakthi - Run Instructions

## Prerequisites
- Node.js & npm
- Python 3.8+
- MongoDB (running on port 27017)

## Setup & Run

### 1. Backend
Open a terminal in `feminine-shakthi/backend`:
```bash
pip install -r requirements.txt
python app.py
```
Server runs at `http://localhost:5000`

### 2. Frontend
Open a terminal in `feminine-shakthi/frontend`:
```bash
npm install
npm run dev
```
App runs at `http://localhost:5173` (or similar)

## Testing the Flow
1. **Language**: Select 'English' or any other.
2. **Register**: 
   - Use Phone: `9999999999`
   - Use Aadhaar: `111122223333` (Starts with '1' for Female)
   - OTP: `1234`
3. **Login**: Use the credentials you just created.
4. **Dashboard**: Post a task (Customer) or Find work (Worker).
