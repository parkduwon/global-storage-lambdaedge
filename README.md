# 실행순서
- aws-marketboro dev
- serverless deploy --aws-profile dev_token --stage dev --verbose
- serverless deploy --aws-profile qa_token --stage qa --verbose
- serverless deploy --aws-profile stage_token --stage stage --verbose
- serverless deploy --aws-profile prod_token --stage prod --verbose
- serverless deploy function -f storage-images-resize --aws-profile dev_token --stage dev --verbose
 