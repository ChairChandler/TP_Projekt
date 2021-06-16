import numpy as np
import pandas as pd
import tensorflow as tf
from surfboard.sound import Waveform
from surfboard.feature_extraction import extract_features
from pathlib import Path

sounds = [Waveform(str(wav)) for wav in [f for f in Path().iterdir() if str(f).endswith('.wav') and not str(f).startswith('test')]]

features: pd.DataFrame = extract_features(sounds, ['mfcc'])
mfcc_feature = np.array([[y.tolist() for y in x] for x in features.to_numpy()])
print(mfcc_feature[0, 0, 0].shape)
# mfcc_feature = np.array([nested.flatten() for nested in mfcc_feature])

# print(mfcc_feature.shape)
# model = tf.keras.Sequential([
# 	tf.keras.layers.SimpleRNN(32, activation='relu'),
# 	tf.keras.layers.Flatten(),
# 	tf.keras.layers.Dense(16, activation='relu', kernel_regularizer=tf.keras.regularizers.L1(0.01), activity_regularizer=tf.keras.regularizers.L1(0.01)),
# 	tf.keras.layers.Dense(1, activation='sigmoid')
# ])
#
# model.compile('adam', tf.keras.losses.binary_crossentropy, tf.keras.metrics.binary_accuracy)
#
# for i, data in enumerate(mfcc_feature):
# 	data = data.reshape(1, -1)
# 	model.train_on_batch(data, np.array([i]))
# 	print(i, model.predict(data))
#
# features: pd.DataFrame = extract_features([Waveform('test_1.wav'), Waveform('test_2.wav')], ['mfcc'], ['mean'])
# mfcc_feature = features.to_numpy()
# mfcc_feature = np.vstack([mfcc_feature, mfcc_feature[:, ::-1]])
# # mfcc_feature = np.vstack([mfcc_feature, mfcc_feature[:]])
# print('TEST', model.predict(mfcc_feature))
#
