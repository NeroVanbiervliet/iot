# Copyright 2017 Intel Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ------------------------------------------------------------------------------

import os
import sys
import pkg_resources

from sawtooth_sdk.processor.core import TransactionProcessor
from handler import SCTransactionHandler

DEFAULT_VALIDATOR_ENDPOINT = 'tcp://localhost:4004'

def main():
    if len(sys.argv) < 2:
        endpoint = DEFAULT_VALIDATOR_ENDPOINT
        print('no validator endpoint passed as argument, defaulting to: ' + endpoint)
    else:
        endpoint = sys.argv[1]

    processor = TransactionProcessor(url=endpoint)
    handler = SCTransactionHandler()
    processor.add_handler(handler)

    try:
        processor.start()
    except KeyboardInterrupt:
        pass
    finally:
        processor.stop()

main()