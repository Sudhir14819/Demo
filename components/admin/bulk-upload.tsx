"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { ProductUtils } from "@/utils/product-utils"
import type { BulkUploadResult } from "@/types/product"

export function BulkUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState("")
  const [jsonData, setJsonData] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<BulkUploadResult | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (selectedFile.type === "application/json") {
          setJsonData(content)
        } else {
          setCsvData(content)
        }
      }
      reader.readAsText(selectedFile)
    }
  }

  const downloadSampleCSV = () => {
    const sampleCSV = ProductUtils.generateSampleCSV()
    const blob = new Blob([sampleCSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-products.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadSampleJSON = () => {
    const sampleProduct = {
      name: "Sample Plant Product",
      category: "plants",
      price: 299,
      currency: "₹",
      rating: 4.5,
      description: "Beautiful sample plant perfect for indoor decoration",
      imagePath: "assets/images/products/sample.png",
      amazonLink: "https://example.com/product",
      discount: 20,
      benefits: ["Easy care", "Air purifying", "Beautiful flowers"],
      stock: 100,
      weight: "500g",
      tags: ["indoor", "flowering", "beginner-friendly"],
    }

    const sampleJSON = JSON.stringify([sampleProduct], null, 2)
    const blob = new Blob([sampleJSON], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-products.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const processBulkUpload = async () => {
    setUploading(true)
    setProgress(0)
    setResult(null)

    try {
      let products: any[] = []

      if (csvData) {
        const { products: csvProducts, errors } = ProductUtils.parseCSVToProducts(csvData)
        if (errors.length > 0) {
          setResult({
            success: false,
            totalProcessed: 0,
            successCount: 0,
            errorCount: errors.length,
            errors: errors.map((error, index) => ({ row: index + 1, error })),
          })
          setUploading(false)
          return
        }
        products = csvProducts
      } else if (jsonData) {
        products = JSON.parse(jsonData)
      }

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const response = await fetch("/api/admin/products/bulk-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ products }),
      })

      const uploadResult = await response.json()
      setResult(uploadResult)
    } catch (error) {
      console.error("Bulk upload error:", error)
      setResult({
        success: false,
        totalProcessed: 0,
        successCount: 0,
        errorCount: 1,
        errors: [{ row: 0, error: "Failed to process upload" }],
      })
    } finally {
      setUploading(false)
      setProgress(100)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Product Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="csv" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="csv">CSV Upload</TabsTrigger>
              <TabsTrigger value="json">JSON Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={downloadSampleCSV} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} disabled={uploading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="csv-data">Or Paste CSV Data</Label>
                <Textarea
                  id="csv-data"
                  placeholder="Paste your CSV data here..."
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={10}
                  disabled={uploading}
                />
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={downloadSampleJSON} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="json-file">Upload JSON File</Label>
                <Input id="json-file" type="file" accept=".json" onChange={handleFileUpload} disabled={uploading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="json-data">Or Paste JSON Data</Label>
                <Textarea
                  id="json-data"
                  placeholder="Paste your JSON data here..."
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  rows={10}
                  disabled={uploading}
                />
              </div>
            </TabsContent>
          </Tabs>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">Processing upload... {progress}%</p>
            </div>
          )}

          <Button onClick={processBulkUpload} disabled={uploading || (!csvData && !jsonData)} className="w-full">
            {uploading ? "Uploading..." : "Upload Products"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{result.totalProcessed}</div>
                  <div className="text-sm text-muted-foreground">Total Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.successCount}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{result.errorCount}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Errors:</h4>
                  {result.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Row {error.row}: {error.error}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
