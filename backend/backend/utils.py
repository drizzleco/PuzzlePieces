import glob
import tempfile

from image_slicer import save_tiles, slice

from backend.defs import FILEPATH_NAMES


def upload_file(bucket, index: int, name: str, num_split: int, filename: str) -> None:
    blob = bucket.blob(f"splits/{name}/{num_split}/{index}.png")
    blob.upload_from_filename(filename)


def slice_images(bucket, name: str, num_split: int) -> None:
    random_file_path = FILEPATH_NAMES[name]
    with tempfile.TemporaryDirectory() as tmpdirname:
        tiles = slice(random_file_path, num_split, save=False)
        save_tiles(tiles, directory=tmpdirname)

        filenames = glob.glob(tmpdirname + "/*")
        for index, filename in enumerate(filenames):
            upload_file(
                bucket=bucket,
                index=index,
                name="airplane",
                num_split=num_split,
                filename=filename,
            )
