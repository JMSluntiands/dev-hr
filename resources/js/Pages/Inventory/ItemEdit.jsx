import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import SearchableSelect from '@/Components/SearchableSelect';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass =
    'block w-full rounded-xl border-0 bg-[#eef3f8] px-3.5 py-2.5 text-slate-800 shadow-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 dark:bg-slate-900 dark:text-white';

function Field({ label, required = false, children }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
                {required && <span className="text-teal-600"> *</span>}
            </span>
            {children}
        </label>
    );
}

export default function ItemEdit({
    item,
    employees = [],
    conditions = [],
    statuses = [],
    itemTypes = [],
    purchaseRequests = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        item_code: item.item_code || '',
        name: item.name || '',
        description: item.description || '',
        type: item.type || '',
        allocated_to_employee_id: item.allocated_to_employee_id
            ? String(item.allocated_to_employee_id)
            : '',
        condition: item.condition || '',
        status: item.status || '',
        remarks: item.remarks || '',
        date_arrived: item.date_arrived || '',
        date_purchased: item.date_purchased || '',
        brand: item.brand || '',
        bought_through_request: Boolean(item.bought_through_request),
        inventory_request_id: item.inventory_request_id
            ? String(item.inventory_request_id)
            : '',
        pictures: [],
        remove_pictures: [],
    });

    const employeeOptions = employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        employee_number: employee.employee_number,
        department: employee.department,
    }));

    const selectedEmployee = employees.find(
        (employee) => String(employee.id) === String(data.allocated_to_employee_id),
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('inventory.items.update', item.id), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Edit inventory item
                </h1>
            }
        >
            <Head title={`Edit ${item.item_code}`} />

            <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Update details for {item.item_code}.
                </p>
                <Link
                    href={route('inventory.items.show', item.id)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                    Cancel
                </Link>
            </div>

            <form
                onSubmit={submit}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6"
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Type / Item description">
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">— Select type —</option>
                            {itemTypes.map((type) => (
                                <option key={type.id} value={type.name}>
                                    {type.name} ({type.code_prefix})
                                </option>
                            ))}
                            {data.type &&
                                !itemTypes.some((type) => type.name === data.type) && (
                                    <option value={data.type}>{data.type}</option>
                                )}
                        </select>
                        <InputError message={errors.type} className="mt-1" />
                    </Field>

                    <Field label="Item ID">
                        <input
                            type="text"
                            value={data.item_code}
                            onChange={(e) => setData('item_code', e.target.value)}
                            className={inputClass}
                        />
                        <InputError message={errors.item_code} className="mt-1" />
                    </Field>

                    <Field label="Item Name" required>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass}
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </Field>

                    <Field label="Brand / Manufacturer">
                        <input
                            type="text"
                            value={data.brand}
                            onChange={(e) => setData('brand', e.target.value)}
                            className={inputClass}
                        />
                        <InputError message={errors.brand} className="mt-1" />
                    </Field>

                    <div className="sm:col-span-2">
                        <Field label="Description">
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={inputClass + ' resize-y'}
                            />
                            <InputError message={errors.description} className="mt-1" />
                        </Field>
                    </div>

                    <Field label="Allocated To">
                        <SearchableSelect
                            value={selectedEmployee?.name ?? ''}
                            onChange={(value) => {
                                const employee = employees.find(
                                    (row) => row.name === value,
                                );
                                setData(
                                    'allocated_to_employee_id',
                                    employee ? String(employee.id) : '',
                                );
                            }}
                            options={employeeOptions}
                            placeholder="— Unallocated —"
                            emptyMessage="No employees found"
                        />
                        <InputError
                            message={errors.allocated_to_employee_id}
                            className="mt-1"
                        />
                    </Field>

                    <Field label="Item Condition">
                        <select
                            value={data.condition}
                            onChange={(e) => setData('condition', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">— Select —</option>
                            {conditions.map((condition) => (
                                <option key={condition} value={condition}>
                                    {condition}
                                </option>
                            ))}
                            {data.condition &&
                                !conditions.includes(data.condition) && (
                                    <option value={data.condition}>{data.condition}</option>
                                )}
                        </select>
                        <InputError message={errors.condition} className="mt-1" />
                    </Field>

                    <Field label="Status">
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">— Select —</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                            {data.status && !statuses.includes(data.status) && (
                                <option value={data.status}>{data.status}</option>
                            )}
                        </select>
                        <InputError message={errors.status} className="mt-1" />
                    </Field>

                    <Field label="Date Arrived">
                        <input
                            type="date"
                            value={data.date_arrived}
                            onChange={(e) => setData('date_arrived', e.target.value)}
                            className={inputClass}
                        />
                        <InputError message={errors.date_arrived} className="mt-1" />
                    </Field>

                    <Field label="Date Purchased">
                        <input
                            type="date"
                            value={data.date_purchased}
                            onChange={(e) => setData('date_purchased', e.target.value)}
                            className={inputClass}
                        />
                        <InputError message={errors.date_purchased} className="mt-1" />
                    </Field>

                    <Field label="Bought through request?">
                        <select
                            value={data.bought_through_request ? '1' : '0'}
                            onChange={(e) => {
                                const yes = e.target.value === '1';
                                setData({
                                    ...data,
                                    bought_through_request: yes,
                                    inventory_request_id: yes
                                        ? data.inventory_request_id
                                        : '',
                                });
                            }}
                            className={inputClass}
                        >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                        <InputError
                            message={errors.bought_through_request}
                            className="mt-1"
                        />
                    </Field>

                    {data.bought_through_request && (
                        <div className="sm:col-span-2">
                            <Field label="Which request?" required>
                                <select
                                    value={data.inventory_request_id}
                                    onChange={(e) =>
                                        setData(
                                            'inventory_request_id',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">— Select request —</option>
                                    {purchaseRequests.map((request) => (
                                        <option key={request.id} value={request.id}>
                                            {request.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.inventory_request_id}
                                    className="mt-1"
                                />
                            </Field>
                        </div>
                    )}

                    <div className="sm:col-span-2">
                        <Field label="Pictures">
                            {(item.pictures || []).filter(
                                (picture) =>
                                    !data.remove_pictures.includes(picture.path),
                            ).length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-3">
                                    {(item.pictures || [])
                                        .filter(
                                            (picture) =>
                                                !data.remove_pictures.includes(
                                                    picture.path,
                                                ),
                                        )
                                        .map((picture) => (
                                            <div
                                                key={picture.path}
                                                className="relative"
                                            >
                                                <img
                                                    src={picture.url}
                                                    alt={item.name}
                                                    className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            'remove_pictures',
                                                            [
                                                                ...data.remove_pictures,
                                                                picture.path,
                                                            ],
                                                        )
                                                    }
                                                    className="absolute -right-1.5 -top-1.5 rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white"
                                                    title="Remove photo"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                    setData(
                                        'pictures',
                                        Array.from(e.target.files || []).slice(
                                            0,
                                            10,
                                        ),
                                    )
                                }
                                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-teal-700"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                You can keep up to 10 photos total. New uploads are
                                added to existing ones.
                                {data.pictures?.length
                                    ? ` Selected to add: ${data.pictures.length}`
                                    : ''}
                            </p>
                            <InputError message={errors.pictures} className="mt-1" />
                            <InputError
                                message={errors['pictures.0']}
                                className="mt-1"
                            />
                        </Field>
                    </div>

                    <div className="sm:col-span-2">
                        <Field label="Remarks">
                            <textarea
                                rows={2}
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                                className={inputClass + ' resize-y'}
                            />
                            <InputError message={errors.remarks} className="mt-1" />
                        </Field>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Link
                        href={route('inventory.items.show', item.id)}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
                    >
                        {processing ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
