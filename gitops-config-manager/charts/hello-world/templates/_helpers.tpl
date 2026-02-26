{{/*
Expand the name of the chart.
Uses nameOverride if provided, otherwise uses Chart.Name.
Truncated to 63 chars — Kubernetes label values have a 63-char limit.
*/}}
{{- define "hello-world.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a fully qualified app name.
Format: <release-name>-<chart-name> unless fullnameOverride is set.
Example: my-release-hello-world
If the release name already contains the chart name, avoid duplication.
*/}}
{{- define "hello-world.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Chart label: chart name + version.
Used in the 'helm.sh/chart' label to identify which chart version deployed this resource.
Slashes are replaced because they're invalid in label values.
*/}}
{{- define "hello-world.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels — applied to EVERY resource this chart creates.
These are the standard Kubernetes recommended labels:
https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/

Selectors (matchLabels) must be a SUBSET of these labels and must be
IMMUTABLE after first deployment. Never add a dynamic value (like image tag)
to selector labels — you'll break rolling updates.
*/}}
{{- define "hello-world.labels" -}}
helm.sh/chart: {{ include "hello-world.chart" . }}
{{ include "hello-world.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: gitops-platform
{{- end }}

{{/*
Selector labels — used in Deployment.spec.selector.matchLabels and Service.spec.selector.
These MUST be stable across upgrades. Once a Deployment is created with these selectors,
you cannot change them without deleting and recreating the Deployment.
*/}}
{{- define "hello-world.selectorLabels" -}}
app.kubernetes.io/name: {{ include "hello-world.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Service account name resolver.
Returns the custom name if set, otherwise auto-generates from fullname.
*/}}
{{- define "hello-world.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "hello-world.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}