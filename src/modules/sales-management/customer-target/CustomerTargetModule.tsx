"use client";

import * as React from "react";
import { useCustomerTarget } from "./hooks/useCustomerTarget";
import { CustomerTargetFormCard } from "./components/CustomerTargetFormCard";
import { CustomerTargetTable } from "./components/CustomerTargetTable";
import { Target, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerTargetModule() {
  const {
    loading,
    submitting,
    deletingId,
    formData,
    setFormData,
    customers,
    filteredCustomers,
    customerTotalCount,
    customerSearch,
    setCustomerSearch,
    loadingCustomers,
    selectedCustomer,
    classifications,
    suppliers,
    products,
    filteredProducts,
    units,
    targets,
    allTargetsCount,
    searchTerm,
    setSearchTerm,
    filterSupplier,
    setFilterSupplier,
    filterClassification,
    setFilterClassification,
    availableUnits,
    handleCustomerChange,
    handleClassificationChange,
    handleSupplierChange,
    handleProductChange,
    handleUomChange,
    handleSubmit,
    handleDeleteTarget,
    resetForm,
    refreshData,
  } = useCustomerTarget();

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Target className="h-6 w-6 text-primary" />
            Customer Target per Product
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure sales target volume for customers based on product categories, suppliers, and unit of measurements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Target Setting Form */}
      <CustomerTargetFormCard
        formData={formData}
        submitting={submitting}
        customers={customers}
        filteredCustomers={filteredCustomers}
        customerTotalCount={customerTotalCount}
        customerSearch={customerSearch}
        onCustomerSearchChange={setCustomerSearch}
        loadingCustomers={loadingCustomers}
        selectedCustomer={selectedCustomer}
        classifications={classifications}
        suppliers={suppliers}
        products={products}
        filteredProducts={filteredProducts}
        units={units}
        availableUnits={availableUnits}
        onCustomerChange={handleCustomerChange}
        onClassificationChange={handleClassificationChange}
        onSupplierChange={handleSupplierChange}
        onProductChange={handleProductChange}
        onUomChange={handleUomChange}
        onDateFromChange={(val) => setFormData((prev) => ({ ...prev, date_from: val }))}
        onDateToChange={(val) => setFormData((prev) => ({ ...prev, date_to: val }))}
        onQtyChange={(val) => setFormData((prev) => ({ ...prev, qty: val }))}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />

      {/* Targets Table */}
      <CustomerTargetTable
        targets={targets}
        allTargetsCount={allTargetsCount}
        loading={loading}
        deletingId={deletingId}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterSupplier={filterSupplier}
        onFilterSupplierChange={setFilterSupplier}
        filterClassification={filterClassification}
        onFilterClassificationChange={setFilterClassification}
        suppliers={suppliers}
        classifications={classifications}
        onDeleteTarget={handleDeleteTarget}
      />
    </div>
  );
}
