# -*- coding: utf-8 -*
import sys
import wenxin_api 
from wenxin_api.tasks.free_qa import FreeQA
from decouple import config

wenxin_api.ak = config("API_KEY")
wenxin_api.sk = config("SECRET_KEY")
input_dict = {
    "text": sys.argv[1],
    # "text": "问题：交朋友的原则是什么？\n回答：",
    "seq_len": 128,
    "topp": 0.3,
    "penalty_score": 1.2,
    "min_dec_len": 2,
    "min_dec_penalty_text": "。?：！[<S>]",
    "is_unidirectional": 0,
    "task_prompt": "adtext",
    # "mask_type": "paragraph"
}
rst = FreeQA.create(**input_dict)
print(rst.get('result'))
