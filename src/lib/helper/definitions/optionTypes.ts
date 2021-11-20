/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {ApiLevelOption, ResponseTimeoutOption} from "zation-client";
import {ComplexTypesOption, BatchOption, SendTimeoutOption} from 'ziron-client';

export interface RequestOptions extends SendTimeoutOption, ApiLevelOption,
        ResponseTimeoutOption, BatchOption, ComplexTypesOption {}

export interface ValidationRequestOptions extends SendTimeoutOption, ApiLevelOption,
    ResponseTimeoutOption, BatchOption, ComplexTypesOption {}

export default interface TransmitOptions
    extends SendTimeoutOption, ApiLevelOption, BatchOption, ComplexTypesOption {}