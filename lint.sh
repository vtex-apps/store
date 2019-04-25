#!/bin/bash

yarn --cwd react --frozen-lockfile
yarn --cwd react lint
