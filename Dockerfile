### Build and service fragments-ui with nginx ###

####################################### Stage 0: Install alpine Linux + node + dependencies #######################################

# Use node version 16.15.1
FROM node:16.15.1-alpine3.15@sha256:1fafca8cf41faf035192f5df1a5387656898bec6ac2f92f011d051ac2344f5c9 AS dependencies

LABEL maintainer="Sanjida Afrin <safrin2@myseneca.ca>"
LABEL description="Fragments ui"

# Set Production environment
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

#######################################  Stage 1: use dependencies to build the site #######################################

# Use node version 16.15.1
FROM node:16.15.1-alpine3.15@sha256:1fafca8cf41faf035192f5df1a5387656898bec6ac2f92f011d051ac2344f5c9 AS builder

# Use /app as our working directory
WORKDIR /app

# Copy cached dependencies from previous stage so we don't have to download
COPY  --from=dependencies /app /app

# Copy src to /app/src/
COPY . .

# Run the parcel build in order to create ./dist, then
# https://explainshell.com/explain?cmd=cp+-a+.%2Fdist%2F.+%2Fusr%2Fshare%2Fnginx%2Fhtml%2F
RUN npm run build

####################################### Stage 2: nginx web server to host the built site #######################################

FROM nginx:stable-alpine@sha256:74694f2de64c44787a81f0554aa45b281e468c0c58b8665fafceda624d31e556 AS deploy

# Put our build/ into /usr/share/nginx/html/ and host static files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# We run our service on port 80
EXPOSE 80

# Health check to see if the docker instance is healthy
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:80 || exit 1

