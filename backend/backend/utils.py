import glob
import tempfile

from image_slicer import save_tiles, slice, calc_columns_rows

from backend.defs import FILEPATH_NAMES


def upload_file(bucket, index: int, name: str, num_split: int, filename: str) -> None:
    blob = bucket.blob(f"splits/{name}/{num_split}/{index}.png")
    blob.upload_from_filename(filename)


def slice_images(bucket, name: str, num_split: int) -> None:
    random_file_path = f"backend/photos/{FILEPATH_NAMES[name]}"
    with tempfile.TemporaryDirectory() as tmpdirname:
        tiles = slice(random_file_path, num_split, save=False)
        columns, rows = calc_columns_rows(num_split)
        indices = []
        for tile in tiles:
            # the library might be wrong. i think this works row and column are 1-indexed and flipped on positions
            index = (tile.column - 1) * columns + (tile.row - 1)
            indices.append(index)
            filename = f"{tmpdirname}/{str(index)}.png"
            tile.save(filename=filename)

        for idx in indices:
            filename = f"{tmpdirname}/{str(idx)}.png"
            upload_file(
                bucket=bucket,
                index=idx,
                name=name,
                num_split=num_split,
                filename=filename,
            )
