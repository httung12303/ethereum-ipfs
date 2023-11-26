import os

def get_file_info(file_path):
  file_size = os.path.getsize(file_path)
  file_type = os.path.splitext(file_path)[1]
  file_name = os.path.basename(file_path)
  return file_size, file_type, file_name

def file_exists(file_path):
  return os.path.exists(file_path)