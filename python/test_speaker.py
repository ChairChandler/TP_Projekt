import os
import sys
import pickle
import warnings
from typing import Dict

import numpy as np
import pandas as pd
from autosklearn.estimators import AutoSklearnClassifier
from sklearn.exceptions import DataConversionWarning
from surfboard.sound import Waveform
from surfboard.feature_extraction import extract_features as get_voice_features
from tqdm import tqdm
from functools import partialmethod

tqdm.__init__ = partialmethod(tqdm.__init__, disable=True)


def get_input_data():
	model_path = input()
	file_path = input()
	mp3 = Waveform(file_path)
	return model_path, mp3


def load_model(model_path):
	with open(model_path, 'rb') as file:
		return pickle.load(file)


def extract_features(sample: Waveform):
	features = ['mfcc', 'log_melspec', 'chroma_stft', 'spectral_slope', 'intensity', 'kurtosis_slidingwindow']
	df_features: pd.DataFrame = get_voice_features([sample], features, statistics_list=['mean'])
	return df_features.to_numpy()


def test_model(feature: np.ndarray, model_meta):
	model: AutoSklearnClassifier = model_meta['model']
	label_mapping: Dict = model_meta['labels']

	label = model.predict(feature)[0]
	person = label_mapping[label]
	probability = model.predict_proba(feature)[0][label]
	return person, probability


def print_output(person, probability):
	print(person)
	sys.stdout.flush()
	print(probability)
	sys.stdout.flush()


def main():
	model_path, mp3 = get_input_data()
	model_meta = load_model(model_path)
	features = extract_features(mp3)
	person, probability = test_model(features, model_meta)
	print_output(person, probability)


if __name__ == '__main__':
	warnings.filterwarnings(action='ignore', category=DataConversionWarning)
	with warnings.catch_warnings():
		warnings.simplefilter("ignore")
		main()
