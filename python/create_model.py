import sys
import warnings
from collections import Counter

import numpy as np
import pandas as pd
from autosklearn.estimators import AutoSklearnClassifier
from sklearn.exceptions import DataConversionWarning
from surfboard.sound import Waveform
from sklearn.preprocessing import LabelEncoder
from surfboard.feature_extraction import extract_features as get_voice_features
import pathlib
import pickle
from tqdm import tqdm
from functools import partialmethod

tqdm.__init__ = partialmethod(tqdm.__init__, disable=True)


def get_input_data():
    paths_num = int(input())
    paths = [{
        'voice_path': input(),
        'owner_name': input()
        } for _ in range(paths_num)]
    return paths


def load_dataset(paths):
    x, y = [], []
    for p in paths:
        mp3 = Waveform(p['voice_path'])
        x.append(mp3)
        y.append(p['owner_name'])

    return np.array(x), np.array(y)


def extract_features(x: np.ndarray):
    features = ['mfcc', 'log_melspec', 'chroma_stft', 'spectral_slope', 'intensity', 'kurtosis_slidingwindow']
    df_features: pd.DataFrame = get_voice_features(x.tolist(), features, statistics_list=['mean'])
    return df_features.to_numpy()


def label_encoding(y: np.ndarray):
    return LabelEncoder().fit_transform(y)


def build_model(x: np.ndarray, y: np.ndarray):
    model = AutoSklearnClassifier(
        time_left_for_this_task=30,
        n_jobs=-1
    )

    model.fit(x, y)
    return model


def print_model_path(model_path):
    print(model_path)
    sys.stdout.flush()


def main():
    paths = get_input_data()
    x, y = load_dataset(paths)
    x = extract_features(x)
    y_labeled = label_encoding(y)
    model = build_model(x, y_labeled)

    with open('model.pkl', 'wb') as file:
        pickle.dump({
            'model': model,
            'labels': {label: user for user, label in zip(y, y_labeled)}
        }, file)

    path = pathlib.Path('model.pkl').absolute()
    print_model_path(path)


if __name__ == '__main__':
    warnings.filterwarnings(action='ignore', category=DataConversionWarning)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        main()
