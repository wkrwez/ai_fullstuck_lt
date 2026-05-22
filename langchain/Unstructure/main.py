from langchain_community.document_loaders import UnstructuredPDFLoader
# file_paths = "./example/刘涛-AI部-差旅费用报销单.xlsx"
file_paths = ['./example/公司假期管理制度.pdf']


loader = UnstructuredPDFLoader(file_paths)

docs = loader.load()

print(docs[0])