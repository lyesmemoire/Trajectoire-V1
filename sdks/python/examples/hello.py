from blueprint import Blueprint

def main():
    bp = Blueprint()
    print(bp.hello())
    print(f"SDK Version: {bp.get_version()}")

if __name__ == "__main__":
    main()
