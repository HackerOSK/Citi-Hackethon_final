@echo off
echo Installing dependencies...
pip install -r requirements.txt

echo Creating dummy model files...
python create_dummy_model.py

echo Done! 